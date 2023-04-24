"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");
require("./type-extensions");
const cli_table3_1 = __importDefault(require("cli-table3"));
const MauveDeployer_1 = require("./deployer/MauveDeployer");
const EATVerifier = "0x5Dbe2B4648FFAF2867F8Ad07d42003F5ce4b7d2C";
(0, config_1.task)("deploy-mauve", "Deploys Mauve contracts", async (args, hre) => {
    const [actor] = await hre.ethers.getSigners();
    const contracts = await MauveDeployer_1.MauveDeployer.deploy(actor, EATVerifier);
    const table = new cli_table3_1.default({
        head: ["Contract", "Address"],
        style: { border: [] },
    });
    for (const item of Object.keys(contracts)) {
        table.push([item, contracts[item].address]);
    }
    console.info(table.toString());
});
