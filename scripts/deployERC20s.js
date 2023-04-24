"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployERC20s = void 0;
const hardhat_1 = require("hardhat");
async function deployERC20s() {
    const ERC20Factory = (await hardhat_1.ethers.getContractFactory("TestERC20"));
    const token0 = await ERC20Factory.deploy("token0", "TOK0");
    const token1 = await ERC20Factory.deploy("token1", "TOK1");
    await token0.deployed();
    await token1.deployed();
    const tokens = [token0, token1];
    return tokens.sort((a, b) => a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1);
}
exports.deployERC20s = deployERC20s;
