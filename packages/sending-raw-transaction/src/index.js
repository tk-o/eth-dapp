const { createPrivateKeyManager, createNetworkSettingsManager } = require('./networkDataManager');
const { createTransaction } = require('./transactionFlow');

const { NETWORK_NAME = 'private' } = process.env;
const { getPrivateKey } = createPrivateKeyManager(NETWORK_NAME);
const networkSettingsManager = createNetworkSettingsManager(NETWORK_NAME);

createTransaction({
  rpcServerUrl: networkSettingsManager.get('rpcServerUrl'),
  sendingAccount: networkSettingsManager.get('sendingAccount'),
  privateKeySender: getPrivateKey(
    networkSettingsManager.get('sendingAccount')
  ),
  receivingAccount: networkSettingsManager.get('receivingAccount'),
}).then(sendTransaction => {
  sendTransaction();
});