import { useCallback, useEffect, useState } from 'react'
import { useAssets } from './use-assets'
import { useAccount, useWalletClient } from 'wagmi'
import { erc20ABI } from 'wagmi'
import BigNumber from 'bignumber.js'
import { createPublicClient, http } from 'viem'

import { getAnchorTagTransactionExpolorerByChain } from '../utils/explorer'
import sleep from '../utils/sleep'
import { getMessageIdFromReceipt, waitForFastlane, waitForNormalExecution } from '../utils/message'
import SJTokenAbi from '../utils/abi/SJTokenAbi.json'

export const AUTO_FASTLANE_FEE = 0.1 // 0.1%

const useSwap = () => {
  const { assets, refresh } = useAssets()
  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()
  const [sourceAsset, setSourceAsset] = useState(assets[0])
  const [destinationAsset, setDestinationAsset] = useState(assets[1])
  const [sourceAssetAmount, setSourceAssetAmount] = useState('')
  const [destinationAssetAmount, setDestinationAssetAmount] = useState('')
  const [status, setStatus] = useState(null)
  const [isSwapping, setIsSwapping] = useState(false)

  const [fastLaneEnabled, setFastLaneEnabled] = useState(true)
  const [showFastLaneOptions, setShowFastLaneOptions] = useState(false)
  const [fastLaneFeeType, setFastLaneFeeType] = useState('Auto')
  const [fastLaneFeePercentage, setFastLaneFeePercentage] = useState('')
  const [fastLaneTimeout, setFastLaneTimeout] = useState(false)

  useEffect(() => {
    if (!address) {
      setSourceAssetAmount('')
      setDestinationAssetAmount('')
    }
  }, [address])

  useEffect(() => {
    setSourceAsset(assets[0])
  }, [assets])

  useEffect(() => {
    setDestinationAsset(assets[1])
  }, [assets])

  const invert = useCallback(() => {
    const destinatonAssetApp = destinationAsset
    const destinationAssetAmountApp = destinationAssetAmount

    setDestinationAsset(sourceAsset)
    setSourceAsset(destinatonAssetApp)

    setDestinationAssetAmount(sourceAssetAmount)
    setSourceAssetAmount(destinationAssetAmountApp)
  }, [sourceAsset, destinationAsset, sourceAssetAmount, destinationAssetAmount])

  const onChangeSourceAssetAmount = useCallback(
    (_amount) => {
      setSourceAssetAmount(_amount)

      if (fastLaneEnabled) {
        setDestinationAssetAmount(
          BigNumber(_amount)
            .minus(
              BigNumber(_amount)
                .multipliedBy(fastLaneFeePercentage.length > 0 ? fastLaneFeePercentage : AUTO_FASTLANE_FEE)
                .dividedBy(100)
            )
            .toFixed()
        )
      } else {
        setDestinationAssetAmount(_amount)
      }

      if (status) setStatus(null)
    },
    [status, fastLaneEnabled, fastLaneFeePercentage]
  )

  const onChangeDestinationAssetAmount = useCallback(
    (_amount) => {
      setDestinationAssetAmount(_amount)

      if (fastLaneEnabled) {
        setSourceAssetAmount(
          BigNumber(_amount)
            .dividedBy(1 - (fastLaneFeePercentage.length > 0 ? fastLaneFeePercentage : AUTO_FASTLANE_FEE) / 100)
            .toFixed()
        )
      } else {
        setSourceAssetAmount(_amount)
      }

      if (status) setStatus(null)
    },
    [status, fastLaneEnabled, fastLaneFeePercentage]
  )

  const swap = useCallback(async () => {
    // TODO: remove it

    try {
      setFastLaneTimeout(false)
      setStatus(null)

      let hash
      const amount = BigNumber(sourceAssetAmount)
        .multipliedBy(10 ** sourceAsset.decimals)
        .toFixed()
      const effectiveFeeFastLanePercentage = fastLaneEnabled
        ? fastLaneFeeType === 'Auto' || fastLaneFeePercentage.length === 0
          ? AUTO_FASTLANE_FEE
          : fastLaneFeePercentage
        : 0
      const fastLaneFeeAmount = BigNumber(amount)
        .multipliedBy(effectiveFeeFastLanePercentage)
        .dividedToIntegerBy(100)
        .toFixed()

      const publicClientSource = createPublicClient({
        chain: sourceAsset.chain,
        transport: http()
      })
      const publicClientDestination = createPublicClient({
        chain: destinationAsset.chain,
        transport: http()
      })

      if (walletClient.chain.id !== sourceAsset.chain.id) {
        await walletClient.switchChain({ id: sourceAsset.chain.id })
        return
      }

      setIsSwapping(true)

      if (sourceAsset.sjTokenAddress !== sourceAsset.address) {
        const allowance = await publicClientSource.readContract({
          account: address,
          address: sourceAsset.address,
          abi: erc20ABI,
          functionName: 'allowance',
          args: [address, sourceAsset.sjTokenAddress]
        })

        if (BigNumber(allowance).isLessThan(amount)) {
          setStatus({
            percentage: 0,
            message: 'Approving ...'
          })

          hash = await walletClient.writeContract({
            account: address,
            address: sourceAsset.address,
            abi: erc20ABI,
            functionName: 'approve',
            args: [sourceAsset.sjTokenAddress, amount]
          })

          setStatus({
            percentage: 0,
            message: `${getAnchorTagTransactionExpolorerByChain(
              hash,
              sourceAsset.chain,
              'Transaction'
            )} broadcated. Waiting for confirmation ...`
          })
          await publicClientSource.waitForTransactionReceipt({ hash })

          setStatus({
            percentage: 0,
            message: 'Approve transaction confirmed!'
          })
        }
      }

      hash = await walletClient.writeContract({
        account: address,
        address: sourceAsset.sjTokenAddress,
        abi: SJTokenAbi,
        functionName: 'xTransfer',
        args: [destinationAsset.chain.id, address, amount, fastLaneFeeAmount]
      })

      setStatus({
        percentage: 25,
        message: `${getAnchorTagTransactionExpolorerByChain(
          hash,
          sourceAsset.chain,
          'Transaction'
        )} broadcated. Waiting for confirmation ...`
      })

      const receipt = await publicClientSource.waitForTransactionReceipt({ hash })

      setStatus({
        percentage: 50,
        message: `${getAnchorTagTransactionExpolorerByChain(
          hash,
          sourceAsset.chain,
          'Transaction'
        )} confirmed. Waiting for finality ...`
      })
      await sleep(2000)

      setStatus({
        percentage: 75,
        message: 'Waiting for cross chain event propagation ...'
      })

      const messageId = getMessageIdFromReceipt(receipt)
      const { transactionHash, method, timeout } = await Promise.race([
        waitForFastlane(publicClientDestination),
        waitForNormalExecution(publicClientDestination, { messageId }),
        sleep(1000 * 60 * 5, { timeout: true })
      ])

      if (timeout) {
        setFastLaneTimeout(true)
        console.log('Timeout ...')
        // TODO
        setSourceAssetAmount('')
        setDestinationAssetAmount('')
        return
      }

      setStatus({
        percentage: 100,
        message:
          method === 'fastLane'
            ? `🎉 The Fast Lane did its ${getAnchorTagTransactionExpolorerByChain(
                transactionHash,
                destinationAsset.chain,
                'Magic'
              )}! Process completed. 🎉 `
            : `${getAnchorTagTransactionExpolorerByChain(transactionHash, destinationAsset.chain, 'Swap')} completed!`
      })

      setSourceAssetAmount('')
      setDestinationAssetAmount('')

      refresh()
    } catch (_err) {
      setStatus(null)
      console.error(_err)
    } finally {
      setIsSwapping(false)
    }
  }, [
    address,
    sourceAsset,
    destinationAsset,
    walletClient,
    sourceAssetAmount,
    fastLaneEnabled,
    fastLaneFeePercentage,
    fastLaneFeeType,
    refresh
  ])

  useEffect(() => {
    if (!fastLaneEnabled) {
      setShowFastLaneOptions(false)
      setFastLaneFeePercentage('')
      setFastLaneFeeType('Auto')
    }
  }, [fastLaneEnabled])

  useEffect(() => {
    if (fastLaneFeeType === 'Auto') {
      setFastLaneFeePercentage('')
    }
  }, [fastLaneFeeType])

  useEffect(() => {
    if (fastLaneFeePercentage.length === 0) {
      setFastLaneFeePercentage('')
      setFastLaneFeeType('Auto')
    }
  }, [fastLaneFeePercentage])

  return {
    destinationAsset,
    destinationAssetAmount,
    fastLaneEnabled,
    fastLaneFeePercentage,
    fastLaneFeeType,
    invert,
    isSwapping,
    onChangeDestinationAssetAmount,
    onChangeSourceAssetAmount,
    setDestinationAssetAmount,
    setFastLaneEnabled,
    setFastLaneFeePercentage,
    setFastLaneFeeType,
    setShowFastLaneOptions,
    showFastLaneOptions,
    sourceAsset,
    sourceAssetAmount,
    status,
    swap
  }
}

export { useSwap }
