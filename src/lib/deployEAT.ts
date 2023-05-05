import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  AccessTokenVerifier,
  AccessTokenVerifier__factory,
} from "../../typechain";

export async function deployEAT(
  deployer: SignerWithAddress,
  eatSigner: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<AccessTokenVerifier> {
  const AccessTokenVerifierFactory = <AccessTokenVerifier__factory>(
    await hre.ethers.getContractFactory("AccessTokenVerifier")
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
