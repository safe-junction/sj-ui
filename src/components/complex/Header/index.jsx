import { ConnectButton } from '@rainbow-me/rainbowkit'
import { IoIosArrowDown } from 'react-icons/io'

const Header = () => {
  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-2 items-center justify-center">
          <img src="./assets/png/logo.png" width={32} height={32} alt="logo" />
          <span className="hover:bg-gray-100 p-2 rounded-xl ml-1 mr-2 text-gray-600 cursor-pointer font-semibold">
            Swap
          </span>
        </div>

        <div className="flex space-x-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
              chainModalOpen,
              ..._props
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== 'loading'
              const connected =
                ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="pt-2 pb-2 pl-4 pr-4 bg-green-200 text-green-500 rounded-3xl font-semibold text-lg hover:text-opacity-50"
                        >
                          Connect
                        </button>
                      )
                    }

                    /*if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="pt-2 pb-2 pl-4 pr-4 bg-red-200 text-red-500 hover:text-opacity-50 rounded-3xl ml-1 mr-2 text-lg font-semibold"
                        >
                          Wrong network
                        </button>
                      )
                    }*/

                    return (
                      <div className="flex justify-between items-center">
                        {!chain.unsupported && (
                          <button
                            onClick={openChainModal}
                            className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 pt-1 pb-1 pl-2 pr-2 rounded-2xl ml-1 mr-2"
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div height={24} width={24} className=" flex justify-between items-center">
                                {chain.iconUrl && (
                                  <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} height={24} width={24} />
                                )}
                                <IoIosArrowDown
                                  className={`ml-0.5 h-4 w-4 transform transition-transform duration-200 ${
                                    chainModalOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            )}
                          </button>
                        )}
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="pt-1 pb-1 pl-2 pr-2 bg-gray-100 rounded-3xl text-md hover:bg-gray-200 text-gray-600 font-medium"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  )
}

export default Header
