const Web3 = require('web3');
const { Transaction: EthereumTx } = require('ethereumjs-tx');

async function createTransaction({
  rpcServerUrl,
  privateKeySender,
  sendingAccount,
  receivingAccount,
  value = Web3.utils.toHex(Web3.utils.toWei('0.01', 'ether')),
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
    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    gasLimit,
    value,
  };

  console.log({rawTx});

  const networkType =  await web3.eth.net.getNetworkType();
  const privateKeySenderBuffer = Buffer.from(privateKeySender, 'hex');
  const txConfig = {};

  if (networkType !== 'private') {
    txConfig.chain = networkType;
  }

  const tx = new EthereumTx(rawTx, txConfig);
  tx.sign(privateKeySenderBuffer);
  const serializedTx = tx.serialize();

  return async function sendTransaction() {
    try {
      const newTx = await web3.eth.sendSignedTransaction(
        web3.utils.toHex(serializedTx)
      );
      console.log(`New TX URL: https://${networkType}.etherscan.io/tx/${newTx.transactionHash}`);
      const sendingAccountBalance = await web3.eth.getBalance(sendingAccount);
      const receivingAccountBalance = await web3.eth.getBalance(receivingAccount);
    
      console.log({ sendingAccountBalance, sendingAccount, receivingAccountBalance, receivingAccount });
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = {
  createTransaction,
};