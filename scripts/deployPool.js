"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployPool = void 0;
const createAndInitializePoolIfNecessary_1 = require("../src/util/createAndInitializePoolIfNecessary");
async function deployPool(deployer, factoryAddress, token0Address, token1Address, fee, initialSqrtPrice) {
    const poolAddress = await (0, createAndInitializePoolIfNecessary_1.createAndInitializePoolIfNecessary)(deployer, factoryAddress, token0Address, token1Address, fee, initialSqrtPrice);
    return poolAddress;
}
exports.deployPool = deployPool;
