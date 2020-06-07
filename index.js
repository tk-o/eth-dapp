const Web3 = require('web3');
const endpointURL = 'https://rinkeby.infura.io/v3/a94750433bc5422f9d41236aa73f4089';
const address = '0xdb34020eAA7f1B94a492b3f2c5427F541925ff36';

async function init() {
  const web3 = new Web3(endpointURL);
  const balance = await web3.eth.getBalance(address);
  const balanceInEther = web3.utils.fromWei(
    balance,
    'ether'
  );

  console.log({ balanceInEther, balance })
}

init();