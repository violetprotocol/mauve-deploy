import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { MauveDeployer } from "../src/deployer/MauveDeployer";
import { ownerBytes32, poolAdminBytes32 } from "../src/util/roles";
import { AccessTokenVerifier, IUniswapV3Factory } from "../typechain";

export async function deployMauve(
  deployer: SignerWithAddress,
  mauveOwner: SignerWithAddress,
  poolAdmin: SignerWithAddress,
  EATVerifier: AccessTokenVerifier
) {
  const {
    factory,
    router02,
    quoter,
    positionManager,
  } = await MauveDeployer.deploy(deployer, EATVerifier.address);

  await (factory as IUniswapV3Factory)
    .connect(deployer)
    .setRole(mauveOwner.address, ownerBytes32);
  await (factory as IUniswapV3Factory)
    .connect(mauveOwner)
    .setRole(poolAdmin.address, poolAdminBytes32);

  return { factory, router02, quoter, positionManager };
}
