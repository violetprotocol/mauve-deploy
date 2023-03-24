import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { deployEAT } from "./deployEAT";
import { deployERC20s } from "./deployERC20s";
import { deployMauve } from "./deployMauve";
import { deployPool } from "./deployPool";
import { mintPosition } from "./mintPosition";
import { performSwap } from "./performSwap";

async function main() {
  const signers = await ethers.getSigners();
  const [deployer, mauveOwner, poolAdmin, eatSigner, trader] = signers;

  const EATVerifier = await deployEAT(deployer, eatSigner);
  const [token0, token1] = await deployERC20s();

  // mint erc20s
  // await token0.connect(trader).mint(parseEther("1"));
  // await token1.connect(trader).mint(parseEther("1"));

  const {
    factory,
    router02,
    quoter,
    nftDescriptorLibrary,
    positionDescriptor,
    positionManager,
  } = await deployMauve(deployer, mauveOwner, poolAdmin);
  await deployPool();
  await mintPosition(positionManager, [token0, token1]);
  await performSwap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
