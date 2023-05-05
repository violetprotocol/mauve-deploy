import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";
import { ethers } from "ethers";
import { FeeAmount, TICK_SPACINGS } from "./constants";
import { generateAccessTokenForMulticall } from "./generateAccessToken";
import { getMaxTick, getMinTick } from "./ticks";

export type MintedResults = {
  tokenId: number;
  liquidity: number;
  amount0: number;
  amount1: number;
};

export const mint = async (
  nonFungiblePositionManager: ethers.Contract,
  tokens: ethers.Contract[],
  minter: SignerWithAddress,
  _receiver: SignerWithAddress,
  eatSigner: SignerWithAddress,
  domain: Domain
): Promise<MintedResults> => {
  const mintParams = {
    token0: tokens[0].address,
    token1: tokens[1].address,
    tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    fee: FeeAmount.MEDIUM,
    recipient: minter.address,
    amount0Desired: 1000000,
    amount1Desired: 1000000,
    amount0Min: 0,
    amount1Min: 0,
    deadline: 1689669489,
  };
  const mintMulticallParameters = [
    nonFungiblePositionManager.interface.encodeFunctionData("mint", [
      mintParams,
    ]),
  ];
  const { eat, expiry } = await generateAccessTokenForMulticall(
    eatSigner,
    domain,
    minter,
    nonFungiblePositionManager,
    mintMulticallParameters
  );

  const [txData] = await nonFungiblePositionManager
    .connect(minter)
    .callStatic["multicall(uint8,bytes32,bytes32,uint256,bytes[])"](
      eat.v,
      eat.r,
      eat.s,
      expiry,
      mintMulticallParameters
    );

  await nonFungiblePositionManager
    .connect(minter)
    ["multicall(uint8,bytes32,bytes32,uint256,bytes[])"](
      eat.v,
      eat.r,
      eat.s,
      expiry,
      mintMulticallParameters
    );

  const {
    tokenId: tokenId,
    liquidity: liquidity,
    amount0: amount0,
    amount1: amount1,
  } = nonFungiblePositionManager.interface.decodeFunctionResult("mint", txData);
  const mintedResults: MintedResults = {
    tokenId,
    liquidity,
    amount0,
    amount1,
  };

  return mintedResults;
};
