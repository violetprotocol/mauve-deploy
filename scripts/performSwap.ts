import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { FeeAmount } from "../src/util/constants";
import { generateAccessTokenForMulticall } from "../src/util/generateAccessToken";

export interface Swap {
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOutMinimum: number;
  sqrtPriceLimit?: BigNumber;
  recipient: string;
  fee: FeeAmount;
}

const MSG_SENDER = "0x0000000000000000000000000000000000000001";
const ADDRESS_THIS = "0x0000000000000000000000000000000000000002";

export async function performSwap(
  swapRouter: Contract,
  swap: Swap,
  trader: SignerWithAddress,
  eatSigner: SignerWithAddress,
  domain: Domain
) {
  const params = {
    tokenIn: swap.tokenIn,
    tokenOut: swap.tokenOut,
    fee: swap.fee,
    recipient: MSG_SENDER,
    amountIn: swap.amountIn,
    amountOutMinimum: swap.amountOutMinimum,
    sqrtPriceLimitX96: swap.sqrtPriceLimit ?? 0,
  };

  const data = [
    swapRouter.interface.encodeFunctionData("exactInputSingle", [params]),
  ];

  const { eat, expiry } = await generateAccessTokenForMulticall(
    eatSigner,
    domain,
    trader,
    swapRouter,
    data
  );

  await swapRouter
    .connect(trader)
    ["multicall(uint8,bytes32,bytes32,uint256,bytes[])"](
      eat.v,
      eat.r,
      eat.s,
      expiry,
      data,
      { value: 0 }
    );
}

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
