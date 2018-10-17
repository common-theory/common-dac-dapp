// Working with the global metamask web3 instance

declare let web3: any;

interface BlockHeader {
  number?: number,
  hash?: string,
  parentHash: string,
  nonce?: string,
  sha3Uncles: string,
  logsBloom?: string,
  transactionsRoot: string,
  stateRoot: string,
  receiptsRoot: string,
  miner: string,
  extraData: string,
  gasLimit: number,
  gasUsed: number,
  timestamp: number
}
