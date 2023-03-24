import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC20__factory } from "../typechain";

export async function deployERC20s(): Promise<Contract[]> {
  const ERC20Factory = <ERC20__factory>await ethers.getContractFactory("ERC20");

  const token0 = await ERC20Factory.deploy("token0", "TOK0");
  const token1 = await ERC20Factory.deploy("token1", "TOK1");

  await token0.deployed();
  await token1.deployed();

  return [token0, token1];
}
