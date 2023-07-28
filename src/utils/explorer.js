const getTransactionExplorerLinkByChain = (_transactionHash, _chain) =>
  `${_chain.blockExplorers.default.url}/tx/${_transactionHash}`

export { getTransactionExplorerLinkByChain }
