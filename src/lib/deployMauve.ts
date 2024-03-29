import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MauveDeployer } from "../deployer/MauveDeployer";
import { ownerBytes32, poolAdminBytes32 } from "../util/roles";
import { IMauveFactory } from "../../typechain";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deployMauve(
  hre: HardhatRuntimeEnvironment,
  deployer: SignerWithAddress,
  mauveOwner: string,
  poolAdmin: string,
  violetId: string,
  EATVerifier: string,
  WETH9Address: string,
) {
  const {
    factory,
    mauveSwapRouter,
    quoter,
    quoterV2,
    positionManager,
    positionDescriptor,
    nftDescriptorLibrary,
  } = await MauveDeployer.deploy(hre, deployer, violetId, EATVerifier, WETH9Address);

  console.log(`Setting poolAdmin (${poolAdmin}) as poolAdmin...`);
  await (factory as IMauveFactory)
    .connect(deployer)
    .setRole(poolAdmin, poolAdminBytes32);
  console.log(`✅ PoolAdmin role assigned.`);

  console.log(`Setting mauveOwner (${mauveOwner}) as owner...`);
  await (factory as IMauveFactory)
    .connect(deployer)
    .setRole(mauveOwner, ownerBytes32);
  console.log(`✅ Owner role assigned.`);

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
