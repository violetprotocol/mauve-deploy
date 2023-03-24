import { ethers } from "hardhat";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";

import { deployEAT } from "./deployEAT";
import { deployERC20s } from "./deployERC20s";
import { deployMauve } from "./deployMauve";
import { deployPool } from "./deployPool";
import { mintPosition } from "./mintPosition";
import { performSwap, Swap } from "./performSwap";
import { getQuote, TradeSingleHop, TradeType } from "./getQuote";
import { FeeAmount, MaxUint128 } from "../src/util/constants";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";
import { parseEther } from "ethers/lib/utils";
import { approveContractsToSpend } from "../src/util/approveContractsToSpend";
import { BigNumber } from "ethers";

async function main() {
  // Get all signers
  const signers = await ethers.getSigners();
  const [
    deployer,
    mauveOwner,
    poolAdmin,
    eatSigner,
    liquidityProvider,
    trader,
    trader2,
  ] = signers;

  // Deploy EATVerifier
  const EATVerifier = await deployEAT(deployer, eatSigner);

  // Deploy ERC20 tokens
  const [token0, token1] = await deployERC20s();

  // mint erc20s
  await token0.connect(liquidityProvider).mint(parseEther("1000000000000000"));
  await token1.connect(liquidityProvider).mint(parseEther("1000000000000000"));
  await token0.connect(trader).mint(parseEther("1000000000000000"));
  await token1.connect(trader).mint(parseEther("1000000000000000"));

  const { factory, router02, quoter, positionManager } = await deployMauve(
    deployer,
    mauveOwner,
    poolAdmin,
    EATVerifier
  );

  console.log(`Factory: ${factory.address}`);
  console.log(`Router: ${router02.address}`);
  console.log(`Quoter: ${quoter.address}`);
  console.log(`NFT Position manager: ${positionManager.address}`);
  console.log("Mauve deployed");

  const poolAddress = await deployPool(
    poolAdmin,
    factory.address,
    token0.address,
    token1.address,
    FeeAmount.MEDIUM,
    encodePriceSqrt(1, 1)
  );

  await approveContractsToSpend([token0, token1], liquidityProvider, [
    positionManager.address,
    router02.address,
    poolAddress,
  ]);

  await approveContractsToSpend([token0, token1], trader, [
    positionManager.address,
    router02.address,
    poolAddress,
  ]);

  const domain: Domain = {
    name: "Ethereum Access Token",
    version: "1",
    chainId: await deployer.getChainId(),
    verifyingContract: EATVerifier.address,
  };

  const lpNFTId = await mintPosition(
    positionManager,
    [token0, token1],
    liquidityProvider,
    trader,
    eatSigner,
    domain
  );

  const trade: TradeSingleHop = {
    tokenIn: token0.address,
    tokenOut: token1.address,
    fee: FeeAmount.MEDIUM,
    amount: MaxUint128,
    sqrtPriceLimit: encodePriceSqrt(100, 102),
  };

  const quote = await getQuote(quoter, TradeType.EXACT_INPUT_SINGLE, trade);

  console.log(quote);

  const swap: Swap = {
    tokenIn: token0.address,
    tokenOut: token1.address,
    amountIn: 3,
    amountOutMinimum: 1,
    recipient: trader.address,
    fee: FeeAmount.MEDIUM,
  };

  await performSwap(router02, swap, trader, eatSigner, domain);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
