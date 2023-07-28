import React from 'react'
import { FiArrowDown } from 'react-icons/fi'
import { useCallback, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

import { useSwap } from './hooks/use-swap'

import Header from './components/complex/Header'
import SwapLine from './components/complex/SwapLine'
import StepProgressBar from './components/base/StepProgressBar'

const App = () => {
  const { isConnected, isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const { chain } = useNetwork()
  const {
    destinationAsset,
    destinationAssetAmount,
    invert,
    isSwapping,
    onChangeDestinationAssetAmount,
    onChangeSourceAssetAmount,
    sourceAsset,
    sourceAssetAmount,
    status,
    swap
  } = useSwap()

  const onButtonClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    if (chain?.unsupported) {
      openChainModal()
      return
    }

    swap()
  }, [isConnected, chain?.unsupported, openConnectModal, openChainModal, swap])

  const buttonText = useMemo(() => {
    if (!isConnected && !isConnecting) return 'Connect Wallet'
    if (isConnecting) return 'Connecting ...'
    if (chain?.unsupported) return 'Wrong network'
    if (sourceAssetAmount === '') return 'Enter an amount ...'
    if (isSwapping) return 'Swapping ...'
    if (isConnected) return 'Swap'
  }, [isConnected, isConnecting, isSwapping, sourceAssetAmount, chain?.unsupported])

  const btnDisabled = useMemo(() => {
    if (chain?.unsupported || !isConnected) return false
    return isConnecting || sourceAssetAmount === '' || isSwapping
  }, [chain?.unsupported, isConnecting, sourceAssetAmount, isSwapping, isConnected])

  const swapLineDisabled = useMemo(() => {
    if (!isConnected || chain?.unsupported || isSwapping) return true
    return false
  }, [isConnected, chain?.unsupported, isSwapping])

  return (
    <React.Fragment>
      <Header />
      <div className="max-w-md mx-auto bg-white pt-3 pb-3 pl-2 pr-2 border border-gray-200 rounded-xl shadow-sm mt-10">
        <div>
          <span className="text-gray-600 text-sm">Swap</span>
        </div>
        <div className="mt-3">
          <SwapLine
            disabled={swapLineDisabled}
            amount={sourceAssetAmount}
            asset={sourceAsset}
            onChangeAmount={onChangeSourceAssetAmount}
            withMax
          />
        </div>
        <div className="relative">
          <button
            className="absolute bg-gray-100 p-2 rounded-lg border-4 border-white hover:bg-gray-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => invert()}
          >
            <FiArrowDown className="text-gray-600 " />
          </button>
        </div>
        <div className="mt-1">
          <SwapLine
            disabled={swapLineDisabled}
            amount={destinationAssetAmount}
            asset={destinationAsset}
            onChangeAmount={onChangeDestinationAssetAmount}
          />
        </div>
        {status && (
          <div className="mt-6 mb-6 pl-4 pr-4">
            <StepProgressBar percent={status.percentage} hasStepZero={true} stepPositions={[0, 25, 50, 75, 100]} />
            <div className="mt-4 flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                <div dangerouslySetInnerHTML={{ __html: status.message }} />
              </span>
            </div>
          </div>
        )}
        <div className="mt-2">
          <button
            disabled={btnDisabled}
            className="pt-2 pb-2 pl-3 pr-3 bg-green-400 hover:bg-green-500 text-white rounded-2xl font-regular text-lg w-full h-14 disabled:opacity-50"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default App
