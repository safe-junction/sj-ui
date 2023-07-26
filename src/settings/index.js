import { gnosis, polygon } from 'viem/chains'

const settings = {
  gnosis: {
    governance: '0x304Db00E1C1C78e240D7BE4a0483B36Bb37FAbFF',
    sjDispatcher: '0xAd7939c19c919EA94Df2017823a24E31C1387f2f',
    sjFactory: '0xbF6D150bf6368d4d90fB9E4B6Da91b4269Bf8E13',
    sjReceiver: '0x93C3dB183C7aE99598285c96c95C2c6e9e70b9b6',
    sjToken: {
      sjTokenAddress: '0x1937C0CdE9B9ffC4bd14364BB0074cC79b6783C5',
      underlyingTokenAddress: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      underlyingTokenName: 'Wrapped XDAI',
      underlyingTokenSymbol: 'WXDAI',
      underlyingTokenDecimals: '18',
      underlyingTokenChainId: '100'
    }
  },
  polygon: {
    governance: '0xBfeD3f449D6f0Ff9aaA2bA219947216782C556eB',
    sjDispatcher: '0x361dAEcE9157D82801f234311477Af8Af35Fae57',
    sjFactory: '0xFe1Ec8c7d004294414D5bF710daf9B735e2E580a',
    sjReceiver: '0x1dA797F5CbA2e027391b49C5fc258e921211BA5a',
    sjToken: {
      sjTokenAddress: '0x5a3dbF1315FFb7EF4e8d4092098DA41D50316d18',
      underlyingTokenAddress: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      underlyingTokenName: 'Wrapped XDAI',
      underlyingTokenSymbol: 'WXDAI',
      underlyingTokenDecimals: '18',
      underlyingTokenChainId: '100'
    }
  },
  assets: [
    {
      address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      name: 'Wrapped XDAI',
      symbol: 'WXDAI',
      decimals: 18,
      chain: gnosis,
      img: './assets/png/dai.png',
      networkImg: './assets/png/gnosis.png'
    },
    {
      address: '0x5a3dbF1315FFb7EF4e8d4092098DA41D50316d18',
      name: 'SJ XDAI',
      symbol: '*WXDAI',
      decimals: 18,
      chain: polygon,
      img: './assets/png/_dai.png',
      networkImg: './assets/png/polygon.png'
    }
  ]
}

export default settings
