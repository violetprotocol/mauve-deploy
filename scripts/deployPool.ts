import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { FeeAmount } from "../src/util/constants";
import { createAndInitializePoolIfNecessary } from "../src/util/createAndInitializePoolIfNecessary";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";

export async function deployPool(
  deployer: SignerWithAddress,
  factoryAddress: string,
  token0Address: string,
  token1Address: string,
  fee: FeeAmount,
  initialSqrtPrice: string
) {
  console.log("DEPLOY POOL ***")
  const poolAddress = await createAndInitializePoolIfNecessary(
    deployer,
    factoryAddress,
    token0Address,
    token1Address,
    fee,
    initialSqrtPrice
  );

  return poolAddress;
}

