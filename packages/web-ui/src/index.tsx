import * as React from 'react';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';

let { rpcHostURL = 'http://localhost:7545' } = window;
const provider =
  typeof window.web3 !== 'undefined'
    ? window.web3.currentProvider
    : new Web3.providers.HttpProvider(rpcHostURL);

let web3 = new Web3(provider);
// @ts-ignore
window.ethereum.enable();

export function Shell() {
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [account, setAccount] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<string | null>(null);
  const [contractOutput, setContractOutput] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    async function getData() {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const balance = await web3.eth.getBalance(accounts[0]);

      setBalance(web3.utils.fromWei(balance, 'ether'));

      // Get the contract address
      const remixContract = new web3.eth.Contract(
        [
          {
            inputs: [],
            name: 'retreive',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'num',
                type: 'uint256',
              },
            ],
            name: 'store',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        '0x4b213d6d8B4108282F19dbfB7daeA7F2Fb7FFfcB'
      );

      setContractOutput(await remixContract.methods.retreive().call());
    }

    getData();
  }, []);

  async function sendTransaction() {
    const receivingAccount = '0xa6FFAE7739604088D738CbD42CA1E4429813E5F8';

    const rawTx = {
      nonce: await web3.eth.getTransactionCount(account!),
      from: account,
      to: receivingAccount,
      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      gasLimit: 21000,
      value: 10_000_000_000_000,
    } as TransactionConfig;

    console.log({ rawTx });

    const networkType = await web3.eth.net.getNetworkType();

    if (networkType !== 'private') {
      rawTx.chain = networkType;
    }

    try {
      const newTx = await web3.eth.sendTransaction(rawTx);

      setAlertMessage(
        `Transaction sent: https://${networkType}.etherscan.io/tx/${newTx.transactionHash}`
      );
    } catch (error) {
      console.error(error.message);
      setAlertMessage(`Transaction could not be sent.`);
    }
  }

  return (
    <main>
      {alertMessage !== null ? <div>{alertMessage}</div> : null}
      <h2>{balance} ETH</h2>
      <button onClick={() => sendTransaction()}>Send transaction</button>
      {contractOutput !== null ? (
        <section>
          <h2>Contract output</h2>
          <output>{contractOutput}</output>
        </section>
      ) : null}
    </main>
  );
}
