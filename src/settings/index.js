import { gnosis, goerli } from 'viem/chains'

const settings = {
  core: {
    100: {
      hashi: {
        yaru: '0x18D0492e4d1e53801302c7364c8709f6BCdfb78b'
      }
    }
  },
  assets: [
    /*{
      address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      chain: gnosis,
      decimals: 18,
      id: 'WXDAI_GNOSIS',
      img: './assets/png/dai.png',
      name: 'Wrapped XDAI',
      networkImg: './assets/png/gnosis.png',
      sjTokenAddress: '0x74323AE38f3cc0c3472ca1c59505AEE77CD90D6c',
      symbol: 'WXDAI'
    },
    {
      address: '0x43951194F8f7FAaB0e89b24a1ee849E5EBA05210',
      chain: polygon,
      decimals: 18,
      img: './assets/png/_dai.png',
      name: 'SJ XDAI',
      networkImg: './assets/png/polygon.png',
      sjTokenAddress: '0x43951194F8f7FAaB0e89b24a1ee849E5EBA05210',
      symbol: '*WXDAI'
    }*/
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
