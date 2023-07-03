import * as hre from "hardhat";
import { MauveDeployer } from "../src/deployer/MauveDeployer";

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const deployer = new MauveDeployer(hre, signer);
  const mauveInterfaceMulticall =
    await deployer.deployMauveInterfaceMulticall();

  console.log(
    `MauveInterfaceMulticall deployed at: ${mauveInterfaceMulticall.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
