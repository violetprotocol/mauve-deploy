import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as hre from "hardhat";
import { deployMauve } from "../src/lib/deployMauve";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const eatVerifier = "0x638734c011F68d2C6d65c7529E02e65C8Fd3B401";
  const violetId = "0x4Bc70da1D9eF635949878E28e9940678af912540";

  const {
    factory,
    mauveSwapRouter,
    quoter,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  } = await deployMauve(
    hre,
    signer as any as SignerWithAddress,
    signer as any as SignerWithAddress,
    signer as any as SignerWithAddress,
    violetId,
    eatVerifier
  );

  console.log(`Factory deployed at: ${factory.address}`);
  console.log(`Router deployed at: ${mauveSwapRouter.address}`);
  console.log(`Quoter deployed at: ${quoter.address}`);
  console.log(`PositionManager deployed at: ${positionManager.address}`);
  console.log(`PositionDescriptor deployed at: ${positionDescriptor.address}`);
  console.log(
    `PositionDescriptorLibrary deployed at: ${nftDescriptorLibrary.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
