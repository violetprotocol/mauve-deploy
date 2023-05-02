import CliTable3 from "cli-table3";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { deployMauve } from "../src/lib/deployMauve";

task("deploy:mauve")
  .addParam("vid", "Address of the violetId contract")
  .addParam("eatVerifier", "Address of the EAT Verifier")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const [
      deployer,
      mauveOwner,
      poolAdmin,
    ] = signers;
    

  const contracts = await deployMauve(
    deployer,
    mauveOwner,
    poolAdmin,
    taskArguments.vid,
    taskArguments.eatVerifier
  );

  console.log("Mauve deployed");

  const table = new CliTable3({
    head: ["Contract", "Address"],
    style: { border: [] },
  });
    // table.push([item, contracts[item].address]);
  table.push(["factory", contracts.factory.address])
  table.push(["quoter", contracts.quoter.address])
  table.push(["mauveSwapRouter", contracts.mauveSwapRouter.address])
  table.push(["positionManager", contracts.positionManager.address])
  table.push(["positionDescriptor", contracts.positionDescriptor.address])
  table.push(["nftDescriptorLibrary", contracts.nftDescriptorLibrary.address])
  console.info(table.toString());
  });

export default {};
