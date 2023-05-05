import CliTable3 from "cli-table3";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { deployEAT } from "../src/lib/deployEAT";

task("deploy:eat")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const signers = await hre.ethers.getSigners();
    const [
      deployer,
      eatSigner
    ] = signers;
    

  const EATVerifier = await deployEAT(deployer, eatSigner, hre)

  console.log("EAT deployed");

  const table = new CliTable3({
    head: ["Contract", "Address"],
    style: { border: [] },
  });
    // table.push([item, contracts[item].address]);
  table.push(["EATVerifier", EATVerifier.address])
  console.info(table.toString());
  });

export default {};
