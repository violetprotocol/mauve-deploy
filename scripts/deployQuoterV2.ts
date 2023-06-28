import * as hre from "hardhat";
import { MauveDeployer } from "../src/deployer/MauveDeployer";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const factory = "0xC0cc4ca3f4EE58947256412d3AE35d90c1941D95";
  const WETH9Address = "0x4200000000000000000000000000000000000006";

  const deployer = new MauveDeployer(hre, signer);
  const quoterV2 = await deployer.deployQuoterV2(factory, WETH9Address);

  console.log(`QuoterV2 deployed at: ${quoterV2.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
