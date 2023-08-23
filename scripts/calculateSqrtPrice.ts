import { ethers } from "hardhat";
import readline from "readline";
import { TestERC20 } from "../typechain";
import BigNumber from "bignumber.js";

const Q96 = new BigNumber(2).pow(96);

async function main() {
  const tokenA = await retry(
    "Please provide address of Token A: ",
    validateAddress
  );
  const tokenB = await retry(
    "Please provide address of Token B: ",
    validateAddress
  );

  if (tokenA == tokenB) throw new Error("Tokens must be different");

  const { token0, token1 } = await getTokens(tokenA, tokenB);

  console.log(
    "Now we will calculate price. You will be ask to provide an amount for each token. This will be a ratio of tokens that will form the price."
  );
  console.log(
    "Example: Amount of TokenA 1000 and Amount of TokenB 10000 is a price of 1000/10000 = 0.1 TokenA per 1 TokenB"
  );
  const amount0 = await retry(
    `Please provide amount of ${token0.symbol}: `,
    validateAmount
  );
  const amount1 = await retry(
    `Please provide amount of ${token1.symbol}: `,
    validateAmount
  );

  // Normalise amounts by multiplying input amounts with token decimals respectively
  const normalisedAmount0 = amount0.times(
    new BigNumber(10).pow(token0.decimals)
  );
  const normalisedAmount1 = amount1.times(
    new BigNumber(10).pow(token1.decimals)
  );

  // Calculate the price of 1 unit of token0 in units of token1
  const ratio = normalisedAmount1.div(normalisedAmount0);

  const sqrtPriceX96 = ratio.sqrt().times(Q96);

  console.log(`Token0: ${token0.address}`);
  console.log(`Token1: ${token1.address}`);
  console.log(
    `The SqrtPriceX96 value to initialize the pool with is: ${sqrtPriceX96.toFixed(
      0
    )}`
  );
}

interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

async function getTokens(
  tokenAddressA: string,
  tokenAddressB: string
): Promise<{ token0: Token; token1: Token }> {
  // Sort the tokens
  let token0, token1;
  if (
    ethers.BigNumber.from(tokenAddressA).lt(
      ethers.BigNumber.from(tokenAddressB)
    )
  ) {
    token0 = tokenAddressA;
    token1 = tokenAddressB;
  } else {
    token0 = tokenAddressB;
    token1 = tokenAddressA;
  }

  // Grab contract details from blockchain
  const token0Contract = <TestERC20>(
    await ethers.getContractAt("TestERC20", token0)
  );
  token0 = {
    address: token0,
    symbol: await token0Contract.callStatic.symbol(),
    decimals: await token0Contract.callStatic.decimals(),
  };

  const token1Contract = <TestERC20>(
    await ethers.getContractAt("TestERC20", token1)
  );
  token1 = {
    address: token1,
    symbol: await token1Contract.callStatic.symbol(),
    decimals: await token1Contract.callStatic.decimals(),
  };

  // Return simplified token structures
  return {
    token0,
    token1,
  };
}

// Validate input as a BigNumber
function validateAmount(amount: string): BigNumber {
  let validatedAmount;
  try {
    validatedAmount = new BigNumber(amount);
  } catch (e) {
    console.log(`Provided amount ${amount} is not a valid number`);
    throw e;
  }

  return validatedAmount;
}

// Validate input as a correct ethereum address
function validateAddress(address: string): string {
  let validatedAddress;
  try {
    validatedAddress = ethers.utils.getAddress(address);
  } catch (e) {
    console.log(`Provided address ${address} is not valid`);
    throw e;
  }

  return validatedAddress;
}

// Retry input prompts given a validator function when validation fails
// Continues to retry unless user escapes using ctrl + c
async function retry<T>(
  query: string,
  validator: (input: string) => T = (input: string) => {
    return <T>input;
  }
): Promise<T> {
  do {
    try {
      const res = await prompt(query);
      return validator(res);
    } catch {
      continue;
    }
  } while (true);
}

// Prompts a user for input given a specific query string
async function prompt(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (res) => {
      rl.close();
      resolve(res);
    })
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
