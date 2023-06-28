import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-watcher";
import "hardhat-dependency-compiler";
import "hardhat-contract-sizer";

import "./tasks/getSqrtPrice";
import "./tasks/deployMauveContracts";
import "./tasks/deployEAT";

if (!process.env.INFURA_API_KEY) {
  throw new Error("Missing OP API KEY");
}

export default {
  networks: {
    localhost: {
      url: `http://localhost:8545`,
    },
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrumRinkeby: {
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimismKovan: {
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimismGoerli: {
      accounts: [
        `0x15b856067decade001ce52ba5c91ff040ef550b0859bf26d1d24d04c4b726917`,
      ],
      url: `https://opt-goerli.g.alchemy.com/v2/Ay4DBPd3SGpvm_8jJM-MS9MhHoqN8-dr`,
      gasPrice: 2000000000,
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      optimisticGoerli: process.env.OPTIMISM_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  contractSizer: {
    runOnCompile: false,
  },
  solidity: {
    compilers: [
      {
        version: "0.7.6",
      },
      {
        version: "0.8.0",
      },
    ],
  },
  watcher: {
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**/*"],
      verbose: true,
    },
  },
  dependencyCompiler: {
    paths: [
      "@violetprotocol/ethereum-access-token/contracts/AccessTokenVerifier.sol",
      "@violetprotocol/mauve-core/contracts/interfaces/IMauvePool.sol",
      "@violetprotocol/mauve-core/contracts/interfaces/IMauveFactory.sol",
    ],
  },
};
