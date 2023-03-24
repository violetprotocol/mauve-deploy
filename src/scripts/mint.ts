import { BigNumber, ethers } from "ethers";
import { FeeAmount } from './constants'
import { encodePriceSqrt } from "./encodePriceSqrt";

export type CreatePoolIfNecessary = (
  token0: string,
  token1: string,
  fee: FeeAmount,
  initialSqrtPriceX96: BigNumber,
  value?: { value: number }
) => Promise<string>

export const mint = async (
    nonFungiblePositionManager: ethers.Contract,
    tokens: ethers.Contract[],
    createAndInitializePoolIfNecessary: CreatePoolIfNecessary
) => {
      await createAndInitializePoolIfNecessary(
        tokens[0].address,
        tokens[1].address,
        FeeAmount.MEDIUM,
        encodePriceSqrt(1, 1)
      )

}
    // it('creates a token', async () => {
    //
    //   const mintParams = {
    //     token0: tokens[0].address,
    //     token1: tokens[1].address,
    //     tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    //     tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    //     fee: FeeAmount.MEDIUM,
    //     recipient: other.address,
    //     amount0Desired: 15,
    //     amount1Desired: 15,
    //     amount0Min: 0,
    //     amount1Min: 0,
    //     deadline: 10,
    //   }
    //   const mintMulticallParameters = [nft.interface.encodeFunctionData('mint', [mintParams])]
    //   const { eat, expiry } = await generateAccessTokenForMulticall(
    //     signer,
    //     domain,
    //     wallet,
    //     nft,
    //     mintMulticallParameters
    //   )
    //
    //   await nft['multicall(uint8,bytes32,bytes32,uint256,bytes[])'](
    //     eat.v,
    //     eat.r,
    //     eat.s,
    //     expiry,
    //     mintMulticallParameters
    //   )
    //   expect(await nft.balanceOf(other.address)).to.eq(1)
    //   expect(await nft.tokenOfOwnerByIndex(other.address, 0)).to.eq(1)
    //   const {
    //     fee,
    //     token0,
    //     token1,
    //     tickLower,
    //     tickUpper,
    //     liquidity,
    //     tokensOwed0,
    //     tokensOwed1,
    //     feeGrowthInside0LastX128,
    //     feeGrowthInside1LastX128,
    //   } = await nft.positions(1)
    //   expect(token0).to.eq(tokens[0].address)
    //   expect(token1).to.eq(tokens[1].address)
    //   expect(fee).to.eq(FeeAmount.MEDIUM)
    //   expect(tickLower).to.eq(getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]))
    //   expect(tickUpper).to.eq(getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]))
    //   expect(liquidity).to.eq(15)
    //   expect(tokensOwed0).to.eq(0)
    //   expect(tokensOwed1).to.eq(0)
    //   expect(feeGrowthInside0LastX128).to.eq(0)
    //   expect(feeGrowthInside1LastX128).to.eq(0)
