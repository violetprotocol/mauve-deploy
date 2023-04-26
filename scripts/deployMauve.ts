import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { MauveDeployer } from "../src/deployer/MauveDeployer";
import { ownerBytes32, poolAdminBytes32 } from "../src/util/roles";
import { AccessTokenVerifier, IMauveFactory } from "../typechain";

export async function deployMauve(
  deployer: SignerWithAddress,
  mauveOwner: SignerWithAddress,
  poolAdmin: SignerWithAddress,
  violetId: string,
  EATVerifier: string
) {
  const {
    factory,
    router02,
    quoter,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  } = await MauveDeployer.deploy(deployer, violetId, EATVerifier);

  await (factory as IMauveFactory)
    .connect(deployer)
    .setRole(mauveOwner.address, ownerBytes32);
  await (factory as IMauveFactory)
    .connect(mauveOwner)
    .setRole(poolAdmin.address, poolAdminBytes32);

  return {
    factory,
    router02,
    quoter,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  };
}

async function main() {
  const [signer] = await ethers.getSigners();
  const eatVerifier = "0x5Dbe2B4648FFAF2867F8Ad07d42003F5ce4b7d2C";
  const violetId = "0x9A119a53cb065202d631ba01d55e3850eDcf3EAa";

  const {
    factory,
    router02,
    quoter,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  } = await deployMauve(
    (signer as any) as SignerWithAddress,
    (signer as any) as SignerWithAddress,
    (signer as any) as SignerWithAddress,
    violetId,
    eatVerifier
  );

  console.log(`Factory deployed at: ${factory.address}`);
  console.log(`Router deployed at: ${router02.address}`);
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
