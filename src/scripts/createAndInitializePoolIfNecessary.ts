import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import {
  IUniswapV3Factory__factory,
  IUniswapV3Pool__factory,
} from "../../typechain";
import { FeeAmount } from "./constants";

export type CreateAndInitializePoolIfNecessary = (
  wallet: Wallet,
  factoryAddress: string,
  token0: string,
  token1: string,
  fee: FeeAmount,
  initialSqrtPriceX96: BigNumber
) => Promise<string>;

export const createAndInitializePoolIfNecessary: CreateAndInitializePoolIfNecessary =
  async (wallet, factoryAddress, token0, token1, fee, initialSqrtPriceX96) => {
    if (!factoryAddress) {
      throw new Error("Missing Factory address");
    }
    const factory = await IUniswapV3Factory__factory.connect(
      factoryAddress,
      wallet
    );
    const pool = await factory.getPool(token0, token1, fee);

    if (pool == ethers.constants.AddressZero) {
      try {
        const createdPoolTx = await factory.createPool(token0, token1, fee);
        const txReceipt = await createdPoolTx.wait();
        const poolAddress = txReceipt.events?.[0].args?.pool;

        if (!poolAddress) {
          throw new Error("Failed to get pool address from creation");
        }

        const poolContract = await IUniswapV3Pool__factory.connect(
          pool,
          wallet
        );
        await poolContract.initialize(initialSqrtPriceX96);

        return poolAddress;
      } catch (error) {
        throw new Error(`Failed to create new pool: ${error}`);
      }
    } else {
      try {
        const poolContract = await IUniswapV3Pool__factory.connect(
          pool,
          wallet
        );
        const { sqrtPriceX96 } = await poolContract.slot0();
        if (sqrtPriceX96.eq(0)) {
          await poolContract.initialize(initialSqrtPriceX96);
        }
        return poolContract.address;
      } catch (error) {
        throw new Error(`Failed to handle already deployed pool: ${error}`);
      }
    }
  };
