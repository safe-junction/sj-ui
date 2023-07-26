import { ProgressBar, Step } from 'react-step-progress-bar'
import { FiArrowDown } from 'react-icons/fi'
import { useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useSwap } from './hooks/use-swap'

import Header from './components/complex/Header'
import SwapLine from './components/complex/SwapLine'

const App = () => {
  const [status, setStatus] = useState(0)
  const { isConnected, isConnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const {
    destinationAsset,
    destinationAssetAmount,
    invert,
    onChangeDestinationAssetAmount,
    onChangeSourceAssetAmount,
    sourceAsset,
    sourceAssetAmount,
    swap
  } = useSwap()

  const onButtonClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal()
      return
    }

    swap()
  }, [isConnected, openConnectModal, swap])

  const buttonText = useMemo(() => {
    if (isConnecting) return 'Connecting ...'
    if (isConnected) return 'Swap'
    if (!isConnected && !isConnecting) return 'Connect Wallet'
  }, [isConnected, isConnecting])

  return (
    <div>
      <Header />
      <div className="max-w-md mx-auto bg-white pt-3 pb-3 pl-2 pr-2 border border-gray-200 rounded-xl shadow-sm">
        <div>
          <span className="text-gray-600 text-sm">Swap</span>
        </div>
        <div className="mt-3">
          <SwapLine amount={sourceAssetAmount} asset={sourceAsset} onChangeAmount={onChangeSourceAssetAmount} withMax />
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
            amount={destinationAssetAmount}
            asset={destinationAsset}
            onChangeAmount={onChangeDestinationAssetAmount}
          />
        </div>
        {status > 0 && (
          <div className="mt-6 mb-6 pl-4 pr-4">
            <ProgressBar
              percent={status === 0 ? 0 : status === 1 ? 25 : status === 2 ? 50 : 100}
              hasStepZero={true}
              stepPositions={[0, 25, 50, 75, 100]}
            >
              <Step transition="scale">
                {({ accomplished }) => (
                  <div
                    className={`h-4 w-4 ${accomplished ? 'bg-green-500' : 'bg-gray-200'} rounded-full`}
                    accomplished={accomplished}
                  ></div>
                )}
              </Step>
              <Step transition="scale">
                {({ accomplished }) => (
                  <div
                    className={`h-4 w-4 ${accomplished ? 'bg-green-500' : 'bg-gray-200'} rounded-full`}
                    accomplished={accomplished}
                  ></div>
                )}
              </Step>
              <Step transition="scale">
                {({ accomplished }) => (
                  <div
                    className={`h-4 w-4 ${accomplished ? 'bg-green-500' : 'bg-gray-200'} rounded-full`}
                    accomplished={accomplished}
                  ></div>
                )}
              </Step>
              <Step transition="scale">
                {({ accomplished }) => (
                  <div
                    className={`h-4 w-4 ${accomplished ? 'bg-green-500' : 'bg-gray-200'} rounded-full`}
                    accomplished={accomplished}
                  ></div>
                )}
              </Step>
              <Step transition="scale">
                {({ accomplished }) => (
                  <div
                    className={`h-4 w-4 ${accomplished ? 'bg-green-500' : 'bg-gray-200'} rounded-full`}
                    accomplished={accomplished}
                  ></div>
                )}
              </Step>
            </ProgressBar>
          </div>
        )}
        <div className="mt-2">
          <button
            disabled={isConnecting || sourceAssetAmount === ''}
            className="pt-2 pb-2 pl-3 pr-3 bg-green-400 hover:bg-green-500 text-white rounded-2xl font-regular text-lg w-full h-14 disabled:opacity-50"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
