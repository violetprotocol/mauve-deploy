"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndInitializePoolIfNecessary = void 0;
const hardhat_1 = require("hardhat");
const typechain_1 = require("../../typechain");
const createAndInitializePoolIfNecessary = async (poolAdmin, factoryAddress, token0, token1, fee, initialSqrtPriceX96) => {
    if (!factoryAddress) {
        throw new Error("Missing Factory address");
    }
    const factory = await typechain_1.IUniswapV3Factory__factory.connect(factoryAddress, poolAdmin);
    const pool = await factory.getPool(token0, token1, fee);
    if (pool == hardhat_1.ethers.constants.AddressZero) {
        try {
            const createdPoolTx = await factory
                .connect(poolAdmin)
                .createPool(token0, token1, fee);
            const txReceipt = await createdPoolTx.wait();
            const poolAddress = txReceipt.events?.[0].args?.pool;
            if (!poolAddress) {
                throw new Error("Failed to get pool address from creation");
            }
            const poolContract = await typechain_1.IUniswapV3Pool__factory.connect(poolAddress, poolAdmin);
            await poolContract.initialize(initialSqrtPriceX96);
            return poolAddress;
        }
        catch (error) {
            throw new Error(`Failed to create new pool: ${error}`);
        }
    }
    else {
        try {
            const poolContract = await typechain_1.IUniswapV3Pool__factory.connect(pool, poolAdmin);
            const { sqrtPriceX96 } = await poolContract.slot0();
            if (sqrtPriceX96.eq(0)) {
                await poolContract.initialize(initialSqrtPriceX96);
            }
            return poolContract.address;
        }
        catch (error) {
            throw new Error(`Failed to handle already deployed pool: ${error}`);
        }
    }
};
exports.createAndInitializePoolIfNecessary = createAndInitializePoolIfNecessary;
