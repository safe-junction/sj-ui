import { gnosis, goerli } from 'viem/chains'

const settings = {
  links: {
    limo: 'https://safe-junction.eth.limo',
    github: 'https://github.com/safe-junction'
  },
  core: {
    5: {
      hashi: {
        yaho: '0x0dCA71eF4f6b64771687E9d9264bA5993bBac4A3',
        yaru: '0x0c2dEDaA5c83Fa106dF5408d86bDfEcf24A284B7'
      },
      safeJunction: {
        sjReceiver: '0x9853f904564489343e9889D34D228Da8AF2A9c90'
      }
    },
    100: {
      hashi: {
        hashi: '0x84dEd061896baCeE181ACf2F9dAc87497663F896',
        yaru: '0xced7e6b4Ff0cfE3fD8dB912FBa12d68Cb14f574e'
      },
      safeJunction: {
        sjReceiver: '0xd4DF5E5F277145ef4D3eC4F718E63700e41c6D6E'
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
      sjTokenAddress: '0xE865bc004f3a9116c060a028bcD18541150fADf2',
      symbol: 'WETH'
    },
    {
      address: '0x7a0e5e1593Ec598c17A3dF306173Fda64b4231f7',
      chain: gnosis,
      id: 'WETH_GNOSIS',
      decimals: 18,
      img: './assets/png/ethereum.png',
      name: 'SJ Wrapped Ether',
      networkImg: './assets/svg/gnosis.svg',
      sjTokenAddress: '0x7a0e5e1593Ec598c17A3dF306173Fda64b4231f7',
      symbol: '*WETH'
    }
  ]
}

export default settings
