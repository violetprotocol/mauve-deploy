import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-ledger";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-watcher";
import "hardhat-dependency-compiler";
import "hardhat-contract-sizer";

import "./tasks/getSqrtPrice";
import "./tasks/deployMauveContracts";
import "./tasks/deployEAT";
import "./tasks/deployPool";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import {
  MAUVE_CORE_COMPILER_SETTINGS,
  MAUVE_PERIPHERY_LOWEST_COMPILER_SETTINGS,
  MAUVE_PERIPHERY_LOW_COMPILER_SETTINGS,
  MAUVE_PERIPHERY_DEFAULT_COMPILER_SETTINGS,
  MAUVE_SWAP_ROUTER_COMPILER_SETTINGS,
} from "./src/compilerSettings";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
const privateKey: string | undefined = process.env.PRIVATE_KEY;
const ledgerAddress: string | undefined = process.env.LEDGER_ACCOUNT_ADDRESS;

if (!privateKey && !mnemonic && !ledgerAddress) {
  throw new Error(
    "Please set a ledger address, a PRIVATE_KEY or MNEMONIC in a .env file"
  );
}

if (!process.env.INFURA_API_KEY) {
  throw new Error("Missing INFURA API KEY");
}

// If a ledger address is defined, it will use that and nothing else.
// If a private key is defined, it will use it and nothing else.
// Otherwise, it will use the mnemonic set in env.
const getAccounts = () => {
  if (ledgerAddress) {
    return {
      accounts: undefined,
      ledgerAccounts: [ledgerAddress],
    };
  } else if (privateKey) {
    return {
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      ledgerAccounts: undefined,
    };
  } else if (mnemonic) {
    return {
      accounts: {
        count: 20,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      ledgerAccounts: undefined,
    };
  }
};

export default {
  networks: {
    localhost: {
      url: `http://localhost:8545`,
    },
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      ...getAccounts(),
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
    },
    ropsten: {
      ...getAccounts(),
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      ...getAccounts(),
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      ...getAccounts(),
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrumRinkeby: {
      ...getAccounts(),
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrum: {
      ...getAccounts(),
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimismGoerli: {
      ...getAccounts(),
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_OP_GOERLI_KEY}`,
      gasPrice: 2000000000,
    },
    optimism: {
      ...getAccounts(),
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
    ],
    overrides: {
      "@violetprotocol/mauve-core/contracts/MauveFactory.sol":
        MAUVE_CORE_COMPILER_SETTINGS,
      "@violetprotocol/mauve-core/contracts/MauvePool.sol":
        MAUVE_CORE_COMPILER_SETTINGS,
      "@violetprotocol/mauve-periphery/contracts/libraries/NFTDescriptor.sol":
        MAUVE_PERIPHERY_LOWEST_COMPILER_SETTINGS,
      "@violetprotocol/mauve-periphery/contracts/NonfungiblePositionManager.sol":
        MAUVE_PERIPHERY_LOW_COMPILER_SETTINGS,
      "@violetprotocol/mauve-periphery/contracts/lens/MauveInterfaceMulticall.sol":
        MAUVE_PERIPHERY_DEFAULT_COMPILER_SETTINGS,
      "@violetprotocol/mauve-swap-router-contracts/contracts/MauveSwapRouter.sol":
        MAUVE_SWAP_ROUTER_COMPILER_SETTINGS,
      "@violetprotocol/mauve-swap-router-contracts/contracts/lens/Quoter.sol":
        MAUVE_SWAP_ROUTER_COMPILER_SETTINGS,
      "@violetprotocol/mauve-swap-router-contracts/contracts/lens/QuoterV2.sol":
        MAUVE_SWAP_ROUTER_COMPILER_SETTINGS,
    },
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
      "@violetprotocol/mauve-core/contracts/MauveFactory.sol",
      "@violetprotocol/mauve-swap-router-contracts/contracts/lens/Quoter.sol",
      "@violetprotocol/mauve-swap-router-contracts/contracts/lens/QuoterV2.sol",
      "@violetprotocol/mauve-swap-router-contracts/contracts/MauveSwapRouter.sol",
      "@violetprotocol/mauve-periphery/contracts/libraries/NFTDescriptor.sol",
      // TODO: Fix compilation of NonfungibleTokenPositionDescriptor
      // See https://github.com/violetprotocol/mauve-deploy/issues/7
      // "@violetprotocol/mauve-periphery/contracts/NonfungibleTokenPositionDescriptor.sol",
      "@violetprotocol/mauve-periphery/contracts/NonfungiblePositionManager.sol",
      "@violetprotocol/mauve-periphery/contracts/lens/MauveInterfaceMulticall.sol",
    ],
  },
};
