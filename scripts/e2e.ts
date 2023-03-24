import { ethers } from "hardhat";
import { deployEAT } from "./deployEAT";
import { deployERC20s } from "./deployERC20s";
import { deployMauve } from "./deployMauve";
import { deployPool } from "./deployPool";
import { mintPosition } from "./mintPosition";
import { performSwap } from "./performSwap";

async function main() {
  await deployEAT();
  const [token0, token1] = await deployERC20s();
  await deployMauve();
  await deployPool();
  await mintPosition();
  await performSwap();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
