import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./type-extensions";

import Table from "cli-table3";

import { MauveDeployer } from "./deployer/MauveDeployer";

const EATVerifier = "0x5Dbe2B4648FFAF2867F8Ad07d42003F5ce4b7d2C";

task("deploy-mauve", "Deploys Mauve contracts", async (args, hre) => {
  const [actor] = await hre.ethers.getSigners();
  const contracts = await MauveDeployer.deploy(actor, EATVerifier);

  const table = new Table({
    head: ["Contract", "Address"],
    style: { border: [] },
  });
  for (const item of Object.keys(contracts)) {
    table.push([item, contracts[item].address]);
  }
  console.info(table.toString());
});
