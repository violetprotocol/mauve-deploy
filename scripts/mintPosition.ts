import { Contract } from "ethers";
import { ethers } from "hardhat";
import { mint } from "../src/scripts/mint";

export async function mintPosition(
  positionManager: Contract,
  tokens: Contract[]
) {
  // await mint(positionManager, tokens, createAndInitializePoolIfNecessary);
}
