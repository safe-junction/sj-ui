import { ConnectButton } from '@rainbow-me/rainbowkit'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const Header = () => {
  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4 items-center justify-center">
          <img src="./assets/png/logo.png" width={32} height={32} alt="logo" />
          <a
            href="#"
            className="flex justify-between items-center bg-white hover:bg-gray-100 p-2 rounded-xl ml-1 mr-2 text-gray-600"
          >
            Swap
          </a>
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
                          className="pt-2 pb-2 pl-3 pr-3 bg-green-400 text-white rounded-3xl font-regular text-lg"
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
                          className="flex justify-between items-center bg-red-400 hover:bg-red-500 pt-1 pb-1 pl-2 pr-2 rounded-2xl ml-1 mr-2 text-white text-lg"
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
                                {chainModalOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                              </div>
                            )}
                          </button>
                        )}
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="pt-1 pb-1 pl-2 pr-2 bg-gray-100 rounded-3xl text-md hover:bg-gray-200 text-gray-600"
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
