import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { deployEAT } from "../src/lib/deployEAT";
import { deployERC20s } from "../src/lib/deployERC20s";
import { deployMauve } from "../src/lib/deployMauve";
import { deployPool } from "../src/lib/deployPool";
import { FeeAmount } from "../src/util/constants";
import { encodePriceSqrt } from "../src/util/encodePriceSqrt";


async function main() {
  const signers = await ethers.getSigners();
  const [
    deployer,
    mauveOwner,
    poolAdmin,
    eatSigner,
  ] = signers;
  const [token0, token1] = await deployERC20s();
  const EATVerifier = await deployEAT(deployer, eatSigner);
  const fee = FeeAmount.MEDIUM;

  const { factory } = await deployMauve(
    deployer,
    mauveOwner,
    poolAdmin,
    "0xB4960F218798c3479E25B0cCc707335216991Fef",
    EATVerifier.address,
  );

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
    poolAdmin,
    factory.address,
    token0.address,
    token1.address,
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
