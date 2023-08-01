import { parseAbiItem } from 'viem'

import settings from '../settings'
import sleep from './sleep'
// import YahoAbi from '../utils/abi/YahoAbi.json'

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

const getMessageIdFromReceipt = (_receipt) => {
  // 0xe2f8f20ddbedfce5eb59a8b930077e7f4906a01300b9318db5f90d1c96c7b6d4 MessageDispatched
  const messageDispatchedLog = _receipt.logs.find(
    ({ topics }) => topics[0] === '0xe2f8f20ddbedfce5eb59a8b930077e7f4906a01300b9318db5f90d1c96c7b6d4'
  )
  return messageDispatchedLog.topics[1]
}

/*const waitForHashiConsensusOnMessage = async (_sourceClient, _destinationClient, _messageId) => {
  const messageHash = await _sourceClient.readContract({
    //account: address,
    address: settings.core[await _sourceClient.getChainId()].hashi.yaho,
    abi: YahoAbi,
    functionName: 'hashes',
    args: [_messageId]
  })

  console.log('messageId', _messageId)
  console.log('messageHash', messageHash)

  while (true) {
    try {
      /*const messageHash = await _destinationClient.readContract({
        //account: address,
        address: settings.core[await _destinationClient.getChainId()].hashi.hashi,
        abi: YahoAbi,
        functionName: 'hashes',
        args: [_messageId]
      })
    } catch (_err) {
      console.error(_err)
    }
  }
}*/

export { waitForFastlane, waitForNormalExecution, getMessageIdFromReceipt }
