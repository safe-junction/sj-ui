import { gnosis, goerli } from 'viem/chains'

const settings = {
  core: {
    100: {
      hashi: {
        yaru: '0x18D0492e4d1e53801302c7364c8709f6BCdfb78b'
      },
      safeJunction: {
        sjReceiver: '0x6Fd8B22924151DFD29167aFc2C921ff157127382'
      }
    }
  },
  assets: [
    {
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      chain: goerli,
      decimals: 18,
      id: 'WETH_GOERLI',
      img: './assets/png/ethereum.png',
      name: 'Wrapped Ether',
      networkImg: './assets/svg/goerli.svg',
      sjTokenAddress: '0xFa1122c3711AedaF46ac6090dC48F16573177BeC',
      symbol: 'WETH'
    },
    {
      address: '0x2815e7Cd58d25D1638776A741318E9b79C4AE845',
      chain: gnosis,
      id: 'WETH_GNOSIS',
      decimals: 18,
      img: './assets/png/ethereum.png',
      name: 'SJ Wrapped Ether',
      networkImg: './assets/svg/gnosis.svg',
      sjTokenAddress: '0x2815e7Cd58d25D1638776A741318E9b79C4AE845',
      symbol: '*WETH'
    }
  ]
}

export default settings
