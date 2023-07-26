import { useCallback, useEffect, useState } from 'react'
import { useAssets } from './use-assets'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { erc20ABI } from 'wagmi'
import BigNumber from 'bignumber.js'

import SJTokenAbi from '../utils/abi/SJTokenAbi.json'

const useSwap = () => {
  const assets = useAssets()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()
  const [sourceAsset, setSourceAsset] = useState(assets[0])
  const [destinationAsset, setDestinationAsset] = useState(assets[1])
  const [sourceAssetAmount, setSourceAssetAmount] = useState('')
  const [destinationAssetAmount, setDestinationAssetAmount] = useState('')

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
      const amount = BigNumber(sourceAssetAmount).multipliedBy(10 ** sourceAsset.decimals)

      if (walletClient.chain.id !== sourceAsset.chain.id) {
        walletClient.switchChain({ id: sourceAsset.chain.id })
      }

      if (sourceAsset.sjTokenAddress !== sourceAsset.address) {
        const allowance = await publicClient.readContract({
          account: address,
          address: sourceAsset.address,
          abi: erc20ABI,
          functionName: 'allowance',
          args: [address, sourceAsset.sjTokenAddress]
        })

        if (BigNumber(allowance).isLessThan(amount)) {
          await walletClient.writeContract({
            account: address,
            address: sourceAsset.address,
            abi: erc20ABI,
            functionName: 'approve',
            args: [sourceAsset.sjTokenAddress, amount]
          })
        }
      }

      const tx = await walletClient.writeContract({
        account: address,
        address: sourceAsset.sjTokenAddress,
        abi: SJTokenAbi,
        functionName: 'xTransfer',
        args: [destinationAsset.chain.id, address, amount]
      })

      // TODO: monitoring the xTransfer
      console.log(tx)
    } catch (_err) {
      console.error(_err)
    }
  }, [address, sourceAsset, destinationAsset, publicClient, walletClient, sourceAssetAmount])

  return {
    destinationAsset,
    destinationAssetAmount,
    invert,
    onChangeDestinationAssetAmount,
    onChangeSourceAssetAmount,
    setDestinationAssetAmount,
    sourceAsset,
    sourceAssetAmount,
    swap
  }
}

export { useSwap }
