import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";
import { BigNumber, ethers, Wallet } from "ethers";
import { FeeAmount, TICK_SPACINGS } from "./constants";
import { generateAccessTokenForMulticall } from "./generateAccessToken";
import { getMaxTick, getMinTick } from "./ticks";

export type CreatePoolIfNecessary = (
  token0: string,
  token1: string,
  fee: FeeAmount,
  initialSqrtPriceX96: BigNumber,
  value?: { value: number }
) => Promise<string>;

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
  receiver: SignerWithAddress,
  eatSigner: SignerWithAddress,
  domain: Domain
): Promise<MintedResults> => {
  const mintParams = {
    token0: tokens[0].address,
    token1: tokens[1].address,
    tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    fee: FeeAmount.MEDIUM,
    recipient: receiver.address,
    amount0Desired: 15,
    amount1Desired: 15,
    amount0Min: 1,
    amount1Min: 1,
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
  console.log("sending multicall");
  const txData = await nonFungiblePositionManager
    .connect(minter)
    ["multicall(uint8,bytes32,bytes32,uint256,bytes[])"](
      eat.v,
      eat.r,
      eat.s,
      expiry,
      mintMulticallParameters
    );
  console.log("sent multicall");
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

// 0x2efb614b multicall
// 000000000000000000000000000000000000000000000000000000000000001c v
// dcd5f50ffde39150c311c552ada322ba2c93b4f35e581639d37f8e785e88ff5f r
// 0c9ed71c99fa34e177347f483456d990832012df984c63cd28fb1f01a60e9f72 s
// 00000000000000000000000000000000000000000000000000000001201ecf94 expiry
// 00000000000000000000000000000000000000000000000000000000000000a0 position of start of bytes[]
// 0000000000000000000000000000000000000000000000000000000000000001 length of bytes[]
// 0000000000000000000000000000000000000000000000000000000000000020 position of first item
// 0000000000000000000000000000000000000000000000000000000000000164 length of first item
// 0x88316456                                                       first item func sig mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))
// 000000000000000000000000f5059a5d33d5853360d16c683c16e67980206f36 token0
// 00000000000000000000000095401dc811bb5740090279ba06cfa8fcf6113778 token1
// 0000000000000000000000000000000000000000000000000000000000000bb8
// fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2764c
// 00000000000000000000000000000000000000000000000000000000000d89b4
// 000000000000000000000000000000000000000000000000000000000000000f
// 000000000000000000000000000000000000000000000000000000000000000f
// 0000000000000000000000000000000000000000000000000000000000000000
// 0000000000000000000000000000000000000000000000000000000000000000
// 00000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a65
// 000000000000000000000000000000000000000000000000000000000000000a
// 00000000000000000000000000000000000000000000000000000000
