import { ethers } from "hardhat";

export async function performSwap() {}

      // async function exactInputSingle(
      //   tokenIn: string,
      //   tokenOut: string,
      //   amountIn: number = 3,
      //   amountOutMinimum: number = 1,      //   sqrtPriceLimitX96?: BigNumber
      // ): Promise<ContractTransaction> {
      //   const inputIsWETH = weth9.address === tokenIn
      //   const outputIsWETH9 = tokenOut === weth9.address
      //
      //   const value = inputIsWETH ? amountIn : 0
      //
      //   const params = {
      //     tokenIn,
      //     tokenOut,
      //     fee: FeeAmount.MEDIUM,
      //     recipient: outputIsWETH9 ? ADDRESS_THIS : MSG_SENDER,
      //     amountIn,
      //     amountOutMinimum,
      //     sqrtPriceLimitX96: sqrtPriceLimitX96 ?? 0,
      //   }
      //
      //   const data = [router.interface.encodeFunctionData('exactInputSingle', [params])]
      //
      //   // ensure that the swap fails if the limit is any tighter
      //   const { eat, expiry } = await generateAccessTokenForMulticall(eatSigner, verifier.domain, trader, router, data)
      //   const [amountOut] = await router
      //     .connect(trader)
      //     .callStatic['multicall(uint8,bytes32,bytes32,uint256,bytes[])'](eat.v, eat.r, eat.s, expiry, data, { value })
      //   expect(BigNumber.from(amountOut).toNumber()).to.be.eq(amountOutMinimum)
      //
      //   if (outputIsWETH9) {
      //     data.push(encodeUnwrapWETH9(amountOutMinimum))
      //   }
      //
      //   const { eat: multicallEAT, expiry: multicallExpiry } = await generateAccessTokenForMulticall(
      //     eatSigner,
      //     verifier.domain,
      //     trader,
      //     router,
      //     data
      //   )
      //   return router
      //     .connect(trader)
      //     ['multicall(uint8,bytes32,bytes32,uint256,bytes[])'](
      //       multicallEAT.v,
      //       multicallEAT.r,
      //       multicallEAT.s,
      //       multicallExpiry,
      //       data,
      //       { value }
      //     )
