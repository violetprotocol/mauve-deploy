"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployEAT = void 0;
const hardhat_1 = require("hardhat");
async function deployEAT(deployer, eatSigner) {
    const AccessTokenVerifierFactory = (await hardhat_1.ethers.getContractFactory("AccessTokenVerifier"));
    const verifier = await AccessTokenVerifierFactory.connect(deployer).deploy(eatSigner.address);
    await verifier.deployed();
    await verifier.connect(eatSigner).rotateIntermediate(eatSigner.address);
    await verifier.connect(eatSigner).activateIssuers([eatSigner.address]);
    return verifier;
}
exports.deployEAT = deployEAT;
