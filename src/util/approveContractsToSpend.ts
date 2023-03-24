import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ethers } from "ethers";
import { TestERC20 } from "../../typechain";

export const approveContractsToSpend = async (
  tokens: TestERC20[],
  owner: SignerWithAddress,
  addressToApprove: string[]
) => {
  await tokens.forEach(async (token) => {
    addressToApprove.forEach(
      async (address) =>
        await token.connect(owner).approve(address, ethers.constants.MaxUint256)
    );
  });
};
