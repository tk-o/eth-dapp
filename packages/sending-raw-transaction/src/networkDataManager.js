

module.exports = {
  /**
   * @param {string} networkName A name of the network the private key manager has to handle.
   */
  createPrivateKeyManager(networkName) {
    const privateKeys = require(`../input/network/${networkName}/secrets.json`);

    if (Object.keys(privateKeys).length === 0) {
      throw new Error(`Private key provider could not be loaded for "${networkName}" network name`);
    }

    return {
      /**
       * @param {string} accountAddress Hex account address
       * 
       * @returns {string|null} Private key for the requested account address, or null, if not found.
       */
      getPrivateKey(accountAddress) {
        return privateKeys[accountAddress] || null;
      }
    }
  },
  createNetworkSettingsManager(networkName) {
    const settings = require(`../input/network/${networkName}/settings.json`);

    if (Object.keys(settings).length === 0) {
      throw new Error(`Network settings provider could not be loaded for "${networkName}" network name`);
    }

    return {
      get(settingName) {
        return settings[settingName] || null;
      }
    }
  }
}