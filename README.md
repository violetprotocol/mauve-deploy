# Mauve Deploy

Repository that contains the code necessary for the deployment of Mauve contracts on an EVM compatible network;
To deploy Mauve contracts, follow the steps outlined below:

Before making this repository public, clean up the git history and remove the PK committed at (e437c05f731d092fa6db6e0818d17c223988f12d). It's a testnet-only address but this will prevent people from reaching out.

## Step-by-step

### Installing

First, clone this repository with:

```sh
$ git clone https://github.com/violetprotocol/mauve-deploy
```

Make sure you have a NPM token configured on your yarn or npm configuration;
If you don't, create a new file under this repo called .npmrc and add your token like so:

```sh
//registry.npmjs.org/:_authToken=$YOUR_TOKEN_HERE
```

Install all dependencies necessary on this package with:

```sh
$ yarn install
```

### Building

To build the mauve-deploy package, simply run:

```sh
$ yarn build
```

### Setting up a client project to inherit mauve-deploy

First, you will need another project that uses hardhat, on this tutorial, we will use the example
of a project called `mauve-v3-periphery`
Please pay attention to the folder structure of this example, as it will come in handy in case your
folders are organized somewhat differently:

```sh
./mauve-deploy
├── LICENSE
├── README.md
├── contracts
├── dist
├── node_modules
├── package.json
├── src
├── tsconfig.json
├── tslint.json
└── yarn.lock
./mauve-v3-periphery
├── LICENSE
├── README.md
├── artifacts
├── audits
├── bug-bounty.md
├── cache
├── contracts
├── deploys.md
├── hardhat.config.ts
├── node_modules
├── package.json
├── test
├── testnet-deploys.md
├── tsconfig.json
├── typechain
├── yarn-error.log
└── yarn.lock
```

On `mauve-v3-periphery` we will add mauve-deploy to be able to use it and deploy our contracts with:

```sh
$ yarn add ../mauve-deploy
```

After adding the mauve-deploy package to your client repo, let's make sure everything works correctly by:

```sh
$ yarn install
```

##### Error recovery:

In case errors are generated from the previous step, we recommend you clean your yarn cache and repeat all above processes,
you can achieve that by:

```sh
$ yarn cache clean
```

### Configuring the client package

In order to use the deploy-mauve script on your client package, we need to configure the hardhat network and private
key that will be used to deploy the smart contracts from Mauve, to do that, open your hardhat.config.ts file, and either modify
or create a new network with the following template, also adding a new import on top of the file that declares the mauve-deploy
package

```ts
import '@violetprotocol/mauve-deploy'

export default {
  networks: {
    optimismGoerli: {
      url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
}
```

You will notice that we need an infura API Key and a wallet Private Key in order to properly initialize this configuration
object, to do that, create a `.env` file on the client project (on our case mauve-v3-periphery) with your credentials:

```sh
INFURA_API_KEY=$YOUR_INFURA_API_KEY
PRIVATE_KEY=$YOUR_PRIVATE_KEY
```

In case your project already uses the dotenv package, you will have no issues with the following steps, but in case you do
not, here is a handy workaround to access `.env` variables on your hardhat.config.ts without having to install a new package;
Add the following lines on the beginning of the script

```ts
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: resolve(__dirname, "./.env") });
```

### Deploying Mauve smart contracts

After the above steps, you are ready to deploy the mauve smart contracts on your preferred network, use the following
command with the network name that you added on your hardhat.config.ts:

```sh
$ yarn hardhat --network optimismGoerli deploy-mauve
```

And you're done. Time to build something great.
