import React, { Fragment, useEffect, useRef, useState } from 'react'
import { FiSettings } from 'react-icons/fi'
import { IoIosArrowDown } from 'react-icons/io'
import { useCallback, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

import { useSwap, AUTO_FASTLANE_FEE } from './hooks/use-swap'

import Header from './components/complex/Header'
import SwapLine from './components/complex/SwapLine'
import StepProgressBar from './components/base/StepProgressBar'
import Box from './components/base/Box'
import OutsideAlerter from './components/base/OutsideAlerter'
import Toggle from './components/base/Toogle'
import ToggleSelect from './components/base/ToggleSelect'

const App = () => {
  const toggleSelectRef = useRef()
  const [showOptions, setShowOptions] = useState(false)
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
    swap,
    fastLaneEnabled,
    setFastLaneEnabled,
    showFastLaneOptions,
    setShowFastLaneOptions,
    fastLaneFeeType,
    setFastLaneFeeType,
    fastLaneFeePercentage,
    setFastLaneFeePercentage
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

  useEffect(() => {
    if (fastLaneFeeType === 'Auto' && toggleSelectRef.current?.selected === 'Custom') {
      toggleSelectRef.current.setSelected('Auto')
    }
  }, [fastLaneFeeType])

  return (
    <React.Fragment>
      <Header />
      <Box className="max-w-sm mx-auto pt-3 pb-1 pl-1 pr-1 mt-10">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm ml-3">Swap</span>
          <OutsideAlerter onOutside={() => setShowOptions(false)}>
            <div className="relative">
              <div
                className={`flex ${
                  fastLaneEnabled ? 'bg-blue-100' : ''
                } pt-1 pl-2 pr-2 pb-1 mr-3 rounded-xl items-center`}
              >
                {fastLaneEnabled && <span className="mr-1 text-xs">Fast Lane</span>}
                <FiSettings
                  className="text-gray-600 cursor-pointer h-5 w-5"
                  onClick={() => setShowOptions(!showOptions)}
                />
              </div>
              {showOptions && (
                <Box className="absolute mt-1 right-0 z-10 pt-2 pb-2 pl-3 pr-3 w-72">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col mr-4">
                      <span className="text-sm text-gray-600">⚡ Fast Lane</span>
                      <span className="text-xs text-gray-400 mt-1">
                        Get instant access to your bridged assets by paying a fee to market makers (when available)
                      </span>
                    </div>
                    <Toggle value={fastLaneEnabled} onChange={(_enabled) => setFastLaneEnabled(_enabled)} />
                  </div>
                  {fastLaneEnabled && (
                    <Fragment>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-400">Fee</span>
                        <span
                          className="flex items-center text-sm text-gray-600 cursor-pointer"
                          onClick={() => setShowFastLaneOptions(!showFastLaneOptions)}
                        >
                          {fastLaneFeeType === 'Custom'
                            ? `${fastLaneFeePercentage.length > 0 ? fastLaneFeePercentage : AUTO_FASTLANE_FEE} %`
                            : fastLaneFeeType}
                          <IoIosArrowDown
                            className={`ml-0.5 h-4 w-4 transform transition-transform duration-200 ${
                              showFastLaneOptions ? 'rotate-180' : ''
                            }`}
                          />
                        </span>
                      </div>
                      {showFastLaneOptions && (
                        <div className="flex items-center justify-between mt-1">
                          <ToggleSelect
                            ref={toggleSelectRef}
                            options={['Auto', 'Custom']}
                            onChange={setFastLaneFeeType}
                          />
                          <div className="relative">
                            <input
                              disabled={fastLaneFeeType !== 'Custom'}
                              className="bg-white border border-gray-200 rounded-xl w-32 pt-1 pl-2 pr-2 pb-1 text-right pr-8 text-gray-600"
                              placeholder={AUTO_FASTLANE_FEE}
                              onChange={(_e) => setFastLaneFeePercentage(_e.target.value)}
                              value={fastLaneFeePercentage}
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-600">%</span>
                          </div>
                        </div>
                      )}
                    </Fragment>
                  )}
                </Box>
              )}
            </div>
          </OutsideAlerter>
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
            className="absolute bg-gray-100 p-1 rounded-lg border-4 border-white hover:bg-gray-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => invert()}
          >
            <IoIosArrowDown className="text-gray-600 " />
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
      </Box>
    </React.Fragment>
  )
}

export default App
