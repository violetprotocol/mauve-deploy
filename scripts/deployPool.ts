import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { FeeAmount } from "../src/scripts/constants";
import { createAndInitializePoolIfNecessary } from "../src/scripts/createAndInitializePoolIfNecessary";

export async function deployPool(
  deployer: SignerWithAddress,
  factoryAddress: string,
  token0Address: string,
  token1Address: string,
  fee: FeeAmount,
  initialSqrtPrice: BigNumber
) {
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
