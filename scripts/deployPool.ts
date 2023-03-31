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

async function main() {
  const [signer] = await ethers.getSigners();
  const factory = "0xC0cc4ca3f4EE58947256412d3AE35d90c1941D95";
  const token0 = "0x4200000000000000000000000000000000000006";
  const token1 = "0xb378eD8647D67b5dB6fD41817fd7a0949627D87a";
  const fee = FeeAmount.MEDIUM;

  const initialSqrtPrice = encodePriceSqrt(
    BigNumber.from("2000"),
    BigNumber.from("1")
  );

  console.log(initialSqrtPrice.toString());

  const poolAddress = await deployPool(
    (signer as any) as SignerWithAddress,
    factory,
    token0,
    token1,
    fee,
    initialSqrtPrice._hex
  );

  console.log(`Pool deployed at: ${poolAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
