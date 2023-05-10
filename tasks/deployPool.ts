import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { deployPool } from "../src/lib/deployPool";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";

// Example:
// npx hardhat deploy:pool --network optimismGoerli --token0 0x4200000000000000000000000000000000000006
// --token1 0x32307adfFE088e383AFAa721b06436aDaBA47DBE --reserve0 2000 --reserve1 1 --factory 0x6A0cb7d3390E7f8420EB5b4b3278BB0D369C3A97 --fee 3000
task("deploy:pool")
  .addParam("token0", "Address of token0 of the pool")
  .addParam("token1", "Address of token1 of the pool")
  .addParam("factory", "Address of the Mauve factory")
  .addParam("reserve0", "Initial reserve of token0")
  .addParam("reserve1", "Initial reserve of token1")
  .addParam("fee", "Fee amount of the pool")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const fee = taskArguments.fee;
    const initialSqrtPrice = encodePriceSqrt(
      BigNumber.from(taskArguments.reserve0),
      BigNumber.from(taskArguments.reserve1)
    );
    console.log("InitialSqrtPrice: ", initialSqrtPrice.toString());
    // Make sure the network you are using has an accounts[] in hardhat.config.ts
    // And you have the correct account that has poolAdmin role
    const signers = await hre.ethers.getSigners();
    const [poolAdmin] = signers;

    const poolAddress = await deployPool(
      poolAdmin,
      taskArguments.factory,
      taskArguments.token0,
      taskArguments.token1,
      fee,
      initialSqrtPrice._hex
    );

    console.log(`Pool deployed at: ${poolAddress}`);
  });

export default {};
