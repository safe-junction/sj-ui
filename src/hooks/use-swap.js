import { useCallback, useEffect, useState } from 'react'
import { useAssets } from './use-assets'

const useSwap = () => {
  const assets = useAssets()
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

  const changeOrder = useCallback(() => {
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

  return {
    changeOrder,
    destinationAsset,
    destinationAssetAmount,
    setDestinationAssetAmount,
    onChangeSourceAssetAmount,
    onChangeDestinationAssetAmount,
    sourceAsset,
    sourceAssetAmount
  }
}

export { useSwap }
