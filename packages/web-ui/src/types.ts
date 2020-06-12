import Web3 from 'web3';
export {}
const web3 = new Web3();
declare global {
  interface Window {
    // @ts-ignore
    web3?: typeof web3;
    rpcHostURL?: string;
  }
}