import { ethers } from "hardhat";
import { TestERC20, TestERC20__factory } from "../../typechain";

export async function deployERC20s(): Promise<TestERC20[]> {
  const ERC20Factory = <TestERC20__factory>(
    await ethers.getContractFactory("TestERC20")
  );

  const token0 = await ERC20Factory.deploy("token0", "TOK0");
  const token1 = await ERC20Factory.deploy("token1", "TOK1");

  await token0.deployed();
  await token1.deployed();

  const tokens = [token0, token1];

  return tokens.sort((a, b) =>
    a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1
  );
}
