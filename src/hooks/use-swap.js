import { useCallback, useEffect, useState } from 'react'
import { useAssets } from './use-assets'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { erc20ABI } from 'wagmi'
import BigNumber from 'bignumber.js'

import SJTokenAbi from '../utils/abi/SJTokenAbi.json'

const useSwap = () => {
  const { assets, refresh } = useAssets()
  const publicClient = usePublicClient()
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

  const onChangeSourceAssetAmount = useCallback((_amount) => {
    setSourceAssetAmount(_amount)
    setDestinationAssetAmount(_amount)
  }, [])

  const onChangeDestinationAssetAmount = useCallback((_amount) => {
    setDestinationAssetAmount(_amount)
    setSourceAssetAmount(_amount)
  }, [])

  const swap = useCallback(async () => {
    try {
      setIsSwapping(true)
      setStatus(null)

      setStatus({
        percentage: 0,
        message: ''
      })

      let hash
      const amount = BigNumber(sourceAssetAmount).multipliedBy(10 ** sourceAsset.decimals)

      if (walletClient.chain.id !== sourceAsset.chain.id) {
        walletClient.switchChain({ id: sourceAsset.chain.id })
      }

      // TODO: remove it
      const sleep = () =>
        new Promise((_resolve) =>
          setTimeout(() => {
            _resolve()
          }, 2000)
        )

      if (sourceAsset.sjTokenAddress !== sourceAsset.address) {
        const allowance = await publicClient.readContract({
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
          await sleep()

          /*hash = await walletClient.writeContract({
            account: address,
            address: sourceAsset.address,
            abi: erc20ABI,
            functionName: 'approve',
            args: [sourceAsset.sjTokenAddress, amount]
          })*/

          setStatus({
            percentage: 0,
            message: 'Approve transaction broadcasted. Waiting confirmation ...'
          })
          await sleep()

          //await publicClient.waitForTransactionReceipt({ hash })

          setStatus({
            percentage: 0,
            message: 'Approve transaction confirmed!'
          })
          await sleep()
        }
      }

      /*hash = await walletClient.writeContract({
        account: address,
        address: sourceAsset.sjTokenAddress,
        abi: SJTokenAbi,
        functionName: 'xTransfer',
        args: [destinationAsset.chain.id, address, amount]
      })*/

      setStatus({
        percentage: 25,
        message: 'Transaction broadcasted. Waiting for confirmation ...'
      })
      await sleep()

      //await publicClient.waitForTransactionReceipt({ hash })

      setStatus({
        percentage: 50,
        message: 'Transaction confirmed. Waiting for finality ...'
      })
      await sleep()

      setStatus({
        percentage: 75,
        message: 'Waiting for cross chain event propagation ...'
      })
      await sleep()

      setStatus({
        percentage: 100,
        message: '🎉 The Fast Lane did its magic! Process completed. 🎉'
      })

      setSourceAssetAmount('')
      setDestinationAssetAmount('')

      refresh()
    } catch (_err) {
      console.error(_err)
    } finally {
      setIsSwapping(false)
    }
  }, [address, sourceAsset, destinationAsset, publicClient, walletClient, sourceAssetAmount, refresh])

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
