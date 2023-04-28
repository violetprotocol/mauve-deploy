import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { deployPool } from "../src/lib/deployPool";
import { FeeAmount } from "../src/util/constants";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";

task("deploy:pool")
  .addParam("token1", "Address of token1 of the pool")
  .addParam("token2", "Address of token2 of the pool")
  .addParam("factory", "Address of the Mauve factory")
  .addParam("eatVerifier", "Address of the EAT Verifier")
  .addParam("token1Price", "Initial price of token1")
  .addParam("token2Price", "Initial price of token2")
  .setAction(async function (taskArguments: TaskArguments, hre) {

    const fee = FeeAmount.MEDIUM;
    const initialSqrtPrice = encodePriceSqrt(
      BigNumber.from(taskArguments.token1Price),
      BigNumber.from(taskArguments.token2Price)
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
    taskArguments.token1,
    taskArguments.token2,
    fee,
    initialSqrtPrice._hex
  );
    
  console.log(`Pool deployed at: ${poolAddress}`);
  });

export default {};
