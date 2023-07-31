import { useCallback, useEffect, useState } from 'react'
import { useAssets } from './use-assets'
import { useAccount, useWalletClient } from 'wagmi'
import { erc20ABI } from 'wagmi'
import BigNumber from 'bignumber.js'
import { createPublicClient, http, parseAbiItem } from 'viem'

import settings from '../settings'
import { getAnchorTagTransactionExpolorerByChain } from '../utils/explorer'

import SJTokenAbi from '../utils/abi/SJTokenAbi.json'

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
      setDestinationAssetAmount(_amount)
      if (status) setStatus(null)
    },
    [status]
  )

  const onChangeDestinationAssetAmount = useCallback(
    (_amount) => {
      setDestinationAssetAmount(_amount)
      setSourceAssetAmount(_amount)
      if (status) setStatus(null)
    },
    [status]
  )

  const swap = useCallback(async () => {
    // TODO: remove it
    const sleep = () =>
      new Promise((_resolve) =>
        setTimeout(() => {
          _resolve()
        }, 2000)
      )

    try {
      setIsSwapping(true)
      setStatus(null)
      setStatus({
        percentage: 0,
        message: 'Starting ...'
      })

      let hash
      const amount = BigNumber(sourceAssetAmount).multipliedBy(10 ** sourceAsset.decimals)
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
      }

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
        args: [destinationAsset.chain.id, address, amount]
      })

      console.log(hash)

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
      await sleep()

      setStatus({
        percentage: 75,
        message: 'Waiting for cross chain event propagation ...'
      })

      // 0xe2f8f20ddbedfce5eb59a8b930077e7f4906a01300b9318db5f90d1c96c7b6d4 MessageDispatched
      const log = receipt.logs.find(
        ({ topics }) => topics[0] === '0xe2f8f20ddbedfce5eb59a8b930077e7f4906a01300b9318db5f90d1c96c7b6d4'
      )
      const messageId = log.topics[1]
      console.log('messageId', messageId)

      const waitForNormalExecutionLogs = async () => {
        while (true) {
          const logs = await publicClientDestination.getLogs({
            address: settings.core[destinationAsset.chain.id].hashi.yaru,
            event: parseAbiItem('event MessageIdExecuted(uint256 indexed fromChainId, bytes32 indexed messageId)'),
            // TODO: filter also on fromChainId
            args: {
              messageId
            }
          })

          if (logs.length > 0) {
            return {
              method: 'normal',
              transactionHash: logs[0].transactionHash
            }
          }
          await sleep()
        }
      }

      const waitForFastlaneLogs = async () => {
        while (true) {
          const logs = await publicClientDestination.getLogs({
            address: settings.core[destinationAsset.chain.id].safeJunction.sjReceiver,
            event: parseAbiItem(
              'event MessageAdvanced((bytes32 salt, uint256 sourceChainId, uint256 underlyingTokenChainId, uint256 amount, address sender, address receiver, address underlyingTokenAddress, uint8 underlyingTokenDecimals, string underlyingTokenName, string underlyingTokenSymbol))'
            )
          })

          // TODO: add check on salt

          if (logs.length > 0) {
            return {
              method: 'fastlane',
              transactionHash: logs[0].transactionHash
            }
          }
          await sleep()
        }
      }

      const { method, transactionHash } = await Promise.race([waitForNormalExecutionLogs(), waitForFastlaneLogs()])

      console.log('method', method)

      setStatus({
        percentage: 100,
        message:
          method === 'fastlane'
            ? `🎉 The Fast Lane did its ${getAnchorTagTransactionExpolorerByChain(
                transactionHash,
                destinationAsset.chain,
                'Magic'
              )}! Process completed. 🎉 `
            : `${getAnchorTagTransactionExpolorerByChain(hash, sourceAsset.chain, 'Swap')} completed!`
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
  }, [address, sourceAsset, destinationAsset, walletClient, sourceAssetAmount, refresh])

  return {
    destinationAsset,
    destinationAssetAmount,
    invert,
    isSwapping,
    onChangeDestinationAssetAmount,
    onChangeSourceAssetAmount,
    setDestinationAssetAmount,
    sourceAsset,
    sourceAssetAmount,
    status,
    swap
  }
}

export { useSwap }
