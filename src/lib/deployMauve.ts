import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MauveDeployer } from "../deployer/MauveDeployer";
import { ownerBytes32, poolAdminBytes32 } from "../util/roles";
import { IMauveFactory } from "../../typechain";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deployMauve(
  hre: HardhatRuntimeEnvironment,
  deployer: SignerWithAddress,
  mauveOwner: SignerWithAddress,
  poolAdmin: SignerWithAddress,
  violetId: string,
  EATVerifier: string
) {
  const {
    factory,
    mauveSwapRouter,
    quoter,
    quoterV2,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  } = await MauveDeployer.deploy(hre, deployer, violetId, EATVerifier);

  await(factory as IMauveFactory)
    .connect(deployer)
    .setRole(mauveOwner.address, ownerBytes32);
  await(factory as IMauveFactory)
    .connect(mauveOwner)
    .setRole(poolAdmin.address, poolAdminBytes32);

  return {
    factory,
    mauveSwapRouter,
    quoter,
    quoterV2,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  };
}
