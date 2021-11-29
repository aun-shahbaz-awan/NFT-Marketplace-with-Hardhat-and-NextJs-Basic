require("@nomiclabs/hardhat-waffle");
const fs = require('fs')
private_key = fs.readFileSync(".secret_key").toString().trim()

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby:{
      url:`https://rinkeby.infura.io/v3/${process.env.RPC_Provider_Id}`,
      accounts:[private_key]
    }
    /*
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    },
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    }
    */
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
