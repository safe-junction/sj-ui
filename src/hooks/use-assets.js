import { useCallback, useEffect, useMemo, useState } from 'react'

import { createPublicClient, http } from 'viem'
import { erc20ABI } from 'wagmi'

import { useAccount } from 'wagmi'
import settings from '../settings'
import BigNumber from 'bignumber.js'
import { formatAssetAmount } from '../utils/amount'

const useAssets = () => {
  const { address: userAddress } = useAccount()
  const [balances, setBalances] = useState([])

  const refresh = useCallback(async () => {
    try {
      if (userAddress) {
        const localBalances = await Promise.all(
          settings.assets.map(({ address: tokenAddress, chain }) => {
            const publicClient = createPublicClient({
              chain,
              transport: http()
            })

            return publicClient.readContract({
              address: tokenAddress,
              abi: erc20ABI,
              functionName: 'balanceOf',
              args: [userAddress]
            })
          })
        )

        setBalances(
          localBalances.map((_balance, _index) => {
            const asset = settings.assets[_index]
            const offchainAmount = BigNumber(_balance).dividedBy(10 ** asset.decimals)

            return {
              balance: offchainAmount.toFixed(),
              formattedBalance: formatAssetAmount(offchainAmount, '', { decimals: 6, forceDecimals: true }),
              formattedBalanceWithSymbol: formatAssetAmount(offchainAmount, asset.symbol, {
                decimals: 6,
                forceDecimals: true
              })
            }
          })
        )
      } else {
        setBalances([])
      }
    } catch (_err) {
      console.error(_err)
    }
  }, [userAddress])

  useEffect(() => {
    refresh()
  }, [refresh])

  const assets = useMemo(() => {
    return settings.assets.map((_asset, _index) => ({
      ..._asset,
      ...balances[_index]
    }))
  }, [balances])

  return {
    assets,
    refresh
  }
}

export { useAssets }
