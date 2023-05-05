import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { IMauveFactory__factory, IMauvePool__factory } from "../../typechain";
import { FeeAmount } from "./constants";

export type CreateAndInitializePoolIfNecessary = (
  poolAdmin: SignerWithAddress,
  factoryAddress: string,
  token0: string,
  token1: string,
  fee: FeeAmount,
  initialSqrtPriceX96: string
) => Promise<string>;

export const createAndInitializePoolIfNecessary: CreateAndInitializePoolIfNecessary = async (
  poolAdmin,
  factoryAddress,
  token0,
  token1,
  fee,
  initialSqrtPriceX96
) => {
  const areTokensSorted = BigNumber.from(token0) > BigNumber.from(token1);

  if (!areTokensSorted) {
    throw new Error("Tokens addresses are not sorted");
  }

  if (!factoryAddress) {
    throw new Error("Missing Factory address");
  }

  const factory = IMauveFactory__factory.connect(
    factoryAddress,
    poolAdmin
  );
  const pool = await factory.getPool(token0, token1, fee);

  if (pool == ethers.constants.AddressZero) {
    try {
      const createdPoolTx = await factory
        .connect(poolAdmin)
        .createPool(token0, token1, fee);
      const txReceipt = await createdPoolTx.wait();
      const poolAddress = txReceipt.events?.[0].args?.pool;

      if (!poolAddress) {
        throw new Error("Failed to get pool address from creation");
      }

      const poolContract = IMauvePool__factory.connect(
        poolAddress,
        poolAdmin
      );

      await poolContract.initialize(initialSqrtPriceX96);

      return poolAddress;
    } catch (error) {
      throw new Error(`Failed to create new pool: ${error}`);
    }
  } else {
    try {
      const poolContract = IMauvePool__factory.connect(pool, poolAdmin);
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
