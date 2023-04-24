"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performSwap = void 0;
const generateAccessToken_1 = require("../src/util/generateAccessToken");
const MSG_SENDER = "0x0000000000000000000000000000000000000001";
const ADDRESS_THIS = "0x0000000000000000000000000000000000000002";
async function performSwap(swapRouter, swap, trader, eatSigner, domain) {
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
    const { eat, expiry } = await (0, generateAccessToken_1.generateAccessTokenForMulticall)(eatSigner, domain, trader, swapRouter, data);
    await swapRouter
        .connect(trader)["multicall(uint8,bytes32,bytes32,uint256,bytes[])"](eat.v, eat.r, eat.s, expiry, data, { value: 0 });
}
exports.performSwap = performSwap;
