import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
  AccessTokenVerifier,
  AccessTokenVerifier__factory,
} from "../typechain";

export async function deployEAT(
  deployer: SignerWithAddress,
  eatSigner: SignerWithAddress
): Promise<AccessTokenVerifier> {
  const AccessTokenVerifierFactory = <AccessTokenVerifier__factory>(
    await ethers.getContractFactory("AccessTokenVerifier")
  );

  const verifier = await AccessTokenVerifierFactory.connect(deployer).deploy(
    eatSigner.address
  );
  await verifier.deployed();

  await verifier.connect(eatSigner).rotateIntermediate(eatSigner.address);
  await verifier.connect(eatSigner).activateIssuers([eatSigner.address]);

  console.log("Deployed EAT verifier")
  return verifier;
}
