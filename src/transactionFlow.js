const Web3 = require('web3');
const { Transaction: EthereumTx } = require('ethereumjs-tx');

async function createTransaction({
  rpcServerUrl,
  privateKeySender,
  sendingAccount,
  receivingAccount,
  value = Web3.utils.toHex(Web3.utils.toWei('0.1', 'ether')),
  gasLimit = Web3.utils.toHex(21000),
  gasPrice = Web3.utils.toHex(Web3.utils.toWei('10', 'gwei'))
}) {
  // 1. connect to a local server
  const web3 = new Web3(rpcServerUrl);
  const sendingAccountBalance = await web3.eth.getBalance(sendingAccount);
  const receivingAccountBalance = await web3.eth.getBalance(receivingAccount);

  console.log({ sendingAccountBalance, sendingAccount, receivingAccountBalance, receivingAccount });

  // 3. Create a raw transaction
  const rawTx = {
    nonce: await web3.eth.getTransactionCount(sendingAccount),
    to: receivingAccount,
    gasPrice,
    gasLimit,
    value,
  };

  const networkType =  await web3.eth.net.getNetworkType();
  const privateKeySenderBuffer = Buffer.from(privateKeySender, 'hex');
  const txConfig = {};

  if (networkType !== 'private') {
    txConfig.chain = networkType;
    txConfig.hardfork = 'constantinople';
  }

  const tx = new EthereumTx(rawTx, txConfig);
  tx.sign(privateKeySenderBuffer);
  const serializedTx = tx.serialize();

  return async function sendTransaction() {
    console.log('sending tx', { tx, networkType });
    web3.eth.sendSignedTransaction(serializedTx)
      .on('receipt', console.log)
      .on('error', console.log)

  };
}

module.exports = {
  createTransaction,
};