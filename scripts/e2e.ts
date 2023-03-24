import { ethers } from "hardhat";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";

import { deployEAT } from "./deployEAT";
import { deployERC20s } from "./deployERC20s";
import { deployMauve } from "./deployMauve";
import { deployPool } from "./deployPool";
import { mintPosition } from "./mintPosition";
import { performSwap } from "./performSwap";
import { getQuote } from "./getQuote";
import { FeeAmount } from "../src/util/constants";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";
import { parseEther } from "ethers/lib/utils";
import { approveContractsToSpend } from "../src/util/approveContractsToSpend";

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
  ] = signers;

  // Deploy EATVerifier
  const EATVerifier = await deployEAT(deployer, eatSigner);

  // Deploy ERC20 tokens
  const [token0, token1] = await deployERC20s();

  // mint erc20s
  await token0.connect(liquidityProvider).mint(parseEther("1"));
  await token1.connect(liquidityProvider).mint(parseEther("1"));
  await token0.connect(trader).mint(parseEther("1"));
  await token1.connect(trader).mint(parseEther("1"));

  const { factory, router02, quoter, positionManager } = await deployMauve(
    deployer,
    mauveOwner,
    poolAdmin
  );

  const poolAddress = await deployPool(
    deployer,
    factory.address,
    token0.address,
    token1.address,
    FeeAmount.LOW,
    encodePriceSqrt(1, 1)
  );

  await approveContractsToSpend([token0, token1], liquidityProvider, [
    positionManager.address,
    router02.address,
  ]);

  await approveContractsToSpend([token0, token1], trader, [
    positionManager.address,
    router02.address,
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
    eatSigner,
    domain
  );

  // const quote = await getQuote(quoter);

  // await performSwap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
