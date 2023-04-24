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
  const token1 = "0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E";
  const token0 = "0x4200000000000000000000000000000000000006"; // WETH
  const fee = FeeAmount.MEDIUM;

  // TODO: Take decimal places into account
  // With USDC, the following led to a price of 0.000000002 because of the difference in decimals
  // const initialSqrtPrice = encodePriceSqrt(
  //   BigNumber.from("1"),
  //   BigNumber.from("2000")
  // );

  // Token1 in token0?
  const initialSqrtPrice = encodePriceSqrt(
    BigNumber.from("1"),
    BigNumber.from("2000")
  );

  console.log("InitialSqrtPrice: ", initialSqrtPrice.toString());

  const poolAddress = await deployPool(
    signer as any as SignerWithAddress,
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
