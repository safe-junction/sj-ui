import './styles/index.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-step-progress-bar/styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, gnosis } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import App from './App'
import reportWebVitals from './reportWebVitals'

gnosis.iconUrl = './assets/png/gnosis.png'

const { chains, publicClient } = configureChains(
  [gnosis, polygon],
  [
    jsonRpcProvider({ rpc: () => ({ http: process.env.REACT_APP_GNOSIS_NODE }) }),
    jsonRpcProvider({ rpc: () => ({ http: process.env.REACT_APP_POLYGON_NODE }) }),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Safe Junction',
  projectId: process.env.REACT_APP_WC2_PROJECT_ID,
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
