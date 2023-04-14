// import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./type-extensions";

// import Table from "cli-table3";

// TODO: Update this to use `deployMauve()` if we want to expose it as a task

// task("deploy-mauve", "Deploys Mauve contracts", async (args, hre) => {
//   const [actor] = await hre.ethers.getSigners();
//   const contracts = await MauveDeployer.deploy(actor, VIOLET_ID_ADDRESS);

//   const table = new Table({
//     head: ["Contract", "Address"],
//     style: { border: [] },
//   });
//   for (const item of Object.keys(contracts)) {
//     table.push([item, contracts[item].address]);
//   }
//   console.info(table.toString());
// });
