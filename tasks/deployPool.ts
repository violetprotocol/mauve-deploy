import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { deployPool } from "../src/lib/deployPool";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";

task("deploy:pool")
  .addParam("token0", "Address of token0 of the pool")
  .addParam("token1", "Address of token1 of the pool")
  .addParam("factory", "Address of the Mauve factory")
  .addParam("eatVerifier", "Address of the EAT Verifier")
  .addParam("reverve0", "Initial price of token0")
  .addParam("reserve1", "Initial price of token1")
  .addParam("fee", "Fee amount of the pool")
  .setAction(async function (taskArguments: TaskArguments, hre) {

    const fee = taskArguments.fee;
    const initialSqrtPrice = encodePriceSqrt(
      BigNumber.from(taskArguments.reserve0),
      BigNumber.from(taskArguments.reserve1)
    )
    console.log("InitialSqrtPrice: ", initialSqrtPrice.toString());
    // Make sure the network you are using has an accounts[] in hardhat.config.ts
    // And you have the correct account that has poolAdmin role
    const signers = await hre.ethers.getSigners();
    const [
      poolAdmin,
    ] = signers;

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
