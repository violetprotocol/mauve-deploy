import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as hre from "hardhat";
import { deployMauve } from "../src/lib/deployMauve";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const eatVerifier = "0x5Dbe2B4648FFAF2867F8Ad07d42003F5ce4b7d2C";
  const violetId = "0x9A119a53cb065202d631ba01d55e3850eDcf3EAa";

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
