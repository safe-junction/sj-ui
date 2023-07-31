import { parseAbiItem } from 'viem'

import settings from '../settings'
import sleep from './sleep'
import YahoAbi from '../utils/abi/YahoAbi.json'

const waitForFastlane = async (_client) => {
  while (true) {
    const logs = await _client.getLogs({
      address: settings.core[await _client.getChainId()].safeJunction.sjReceiver,
      event: parseAbiItem(
        'event MessageAdvanced((bytes32 salt, uint256 sourceChainId, uint256 underlyingTokenChainId, uint256 amount, address sender, address receiver, address underlyingTokenAddress, uint8 underlyingTokenDecimals, string underlyingTokenName, string underlyingTokenSymbol))'
      )
    })

    // TODO: add check on salt

    if (logs.length > 0) {
      return {
        transactionHash: logs[0].transactionHash
      }
    }
    await sleep(4000)
  }
}

const waitForNormalExecution = async (_client, { messageId }) => {
  while (true) {
    const logs = await _client.getLogs({
      address: settings.core[await _client.getChainId()].hashi.yaru,
      event: parseAbiItem('event MessageIdExecuted(uint256 indexed fromChainId, bytes32 indexed messageId)'),
      // TODO: filter also on fromChainId
      args: {
        messageId
      }
    })

    if (logs.length > 0) {
      return {
        transactionHash: logs[0].transactionHash
      }
    }
    await sleep(4000)
  }
}

export { waitForFastlane, waitForNormalExecution }
