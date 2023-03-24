import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";
import { AccessTokenVerifier } from "@violetprotocol/ethereum-access-token-helpers/dist/types";
import { BigNumber, ethers, Wallet } from "ethers";
import { FeeAmount, TICK_SPACINGS } from './constants'
import { encodePriceSqrt } from "./encodePriceSqrt";
import { generateAccessTokenForMulticall } from "./generateAccessToken";
import { getMaxTick, getMinTick } from "./ticks";

export type CreatePoolIfNecessary = (
  token0: string,
  token1: string,
  fee: FeeAmount,
  initialSqrtPriceX96: BigNumber,
  value?: { value: number }
) => Promise<string>

export type MintedResults = {
  tokenId: number
  liquidity: number,
  amount0: number,
  amount1: number,
}

export const mint = async (
    nonFungiblePositionManager: ethers.Contract,
    tokens: ethers.Contract[],
    createAndInitializePoolIfNecessary: CreatePoolIfNecessary,
    addressToMintFrom: ethers.Wallet,
    signer: Wallet,
    domain: Domain,
): Promise<MintedResults>  => {
      await createAndInitializePoolIfNecessary(
        tokens[0].address,
        tokens[1].address,
        FeeAmount.MEDIUM,
        encodePriceSqrt(1, 1)
      )

      const mintParams = {
        token0: tokens[0].address,
        token1: tokens[1].address,
        tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        fee: FeeAmount.MEDIUM,
        recipient: addressToMintFrom.address,
        amount0Desired: 15,
        amount1Desired: 15,
        amount0Min: 0,
        amount1Min: 0,
        deadline: 10,
      }
      const mintMulticallParameters = [nonFungiblePositionManager.interface.encodeFunctionData('mint', [mintParams])]
      const { eat, expiry } = await generateAccessTokenForMulticall(
        signer,
        domain,
        addressToMintFrom,
        nonFungiblePositionManager,
        mintMulticallParameters
      )
      const txData = await nonFungiblePositionManager['multicall(uint8,bytes32,bytes32,uint256,bytes[])'](
        eat.v,
        eat.r,
        eat.s,
        expiry,
        mintMulticallParameters
      );
      const { tokenId: tokenId, liquidity: liquidity, amount0: amount0, amount1: amount1 } = nonFungiblePositionManager.interface.decodeFunctionResult('collect', txData)
      const mintedResults: MintedResults = {
        tokenId,
        liquidity,
        amount0,
        amount1
      }

      return mintedResults;

}
