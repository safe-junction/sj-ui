import { gnosis, goerli } from 'viem/chains'

const settings = {
  links: {
    limo: 'https://safe-junction.eth.limo',
    github: 'https://github.com/safe-junction'
  },
  core: {
    100: {
      hashi: {
        yaru: '0x18D0492e4d1e53801302c7364c8709f6BCdfb78b',
        hashi: '0x22d64748F4d13576d4615EA854Fbc4283C49Cf32'
      },
      safeJunction: {
        sjReceiver: '0xFf84F0a128f43d36F2e91F7850916d458674acA8'
      }
    },
    5: {
      hashi: {
        yaru: '0x3A36cA18bF7e1BAC5656CA719AD24F7A97F27bd9',
        yaho: '0xE8F3f26D59b65c17aF64E5C0381DB193B2247F0d'
      },
      safeJunction: {
        sjReceiver: '0x438B1FF80D2d6D0040d4C1d29ab9C260939c7f87'
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
      sjTokenAddress: '0x5e9712e80E275B8c2c5b403e3c8eEAcb6EA333E6',
      symbol: 'WETH'
    },
    {
      address: '0xbB2434A551F0fEcA5220bD5EaB763275b5d96a88',
      chain: gnosis,
      id: 'WETH_GNOSIS',
      decimals: 18,
      img: './assets/png/ethereum.png',
      name: 'SJ Wrapped Ether',
      networkImg: './assets/svg/gnosis.svg',
      sjTokenAddress: '0xbB2434A551F0fEcA5220bD5EaB763275b5d96a88',
      symbol: '*WETH'
    }
  ]
}

export default settings
