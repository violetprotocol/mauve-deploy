import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { abi } from "@violetprotocol/mauve-core/artifacts/contracts/MauvePool.sol/MauvePool.json";
import { IMauvePool } from "../typechain";

task("get:sqrtPrice")
  .addParam("pool", "Address of pool to check")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const pool = <IMauvePool>(
      await ethers.getContractAt(abi, taskArguments.pool)
    );

    const slot0 = await pool.callStatic.slot0();
    console.log(slot0.sqrtPriceX96._hex);
    console.log(slot0.sqrtPriceX96.toString());

    console.log(slot0.tick);
    console.log(await pool.callStatic.liquidity());
  });

export default {};
