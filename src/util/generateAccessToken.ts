import { Wallet, BigNumber, ethers } from "ethers";
import { messages, utils } from "@violetprotocol/ethereum-access-token-helpers";
// import { EATMulticall } from '../../typechain'
import { splitSignature } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const generateAccessToken = async (
  signer: Wallet,
  domain: messages.Domain,
  functionName: string,
  caller: Wallet,
  contract: ethers.Contract,
  parameters: any[],
  expiry?: BigNumber
) => {
  const token = {
    functionCall: {
      functionSignature: contract.interface.getSighash(functionName),
      target: ethers.utils.getAddress(contract.address),
      caller: ethers.utils.getAddress(caller.address),
      parameters: utils.packParameters(
        contract.interface,
        functionName,
        parameters
      ),
    },
    expiry: expiry || BigNumber.from(4833857428),
  };

  const eat = splitSignature(
    await utils.signAccessToken(signer, domain, token)
  );

  return { eat, expiry: token.expiry };
};

export const generateAccessTokenForMulticall = async (
  signer: SignerWithAddress,
  domain: messages.Domain,
  caller: SignerWithAddress,
  // contract: EATMulticall,
  contract: ethers.Contract,
  parameters: any[],
  expiry?: BigNumber
) => {
  const token = {
    functionCall: {
      functionSignature: contract.interface.getSighash(
        "multicall(uint8,bytes32,bytes32,uint256,bytes[])"
      ),
      target: ethers.utils.getAddress(contract.address),
      caller: ethers.utils.getAddress(caller.address),
      parameters: utils.packParameters(
        contract.interface,
        "multicall(uint8,bytes32,bytes32,uint256,bytes[])",
        [parameters]
      ),
    },
    expiry: expiry || BigNumber.from(4833857428),
  };

  const eat = splitSignature(
    await utils.signAccessToken(signer, domain, token)
  );

  return { eat, expiry: token.expiry };
};

export const generateAccessTokenForMulticallWithDeadline = async (
  signer: Wallet,
  domain: messages.Domain,
  caller: Wallet,
  // contract: EATMulticall,
  contract: ethers.Contract,
  parameters: any[],
  expiry?: BigNumber
) => {
  const token = {
    functionCall: {
      functionSignature: contract.interface.getSighash(
        "multicall(uint8,bytes32,bytes32,uint256,uint256,bytes[])"
      ),
      target: ethers.utils.getAddress(contract.address),
      caller: ethers.utils.getAddress(caller.address),
      parameters: utils.packParameters(
        contract.interface,
        "multicall(uint8,bytes32,bytes32,uint256,uint256,bytes[])",
        parameters
      ),
    },
    expiry: expiry || BigNumber.from(4833857428),
  };

  const eat = splitSignature(
    await utils.signAccessToken(signer, domain, token)
  );

  return { eat, expiry: token.expiry };
};
