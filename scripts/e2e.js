"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const deployEAT_1 = require("./deployEAT");
const deployERC20s_1 = require("./deployERC20s");
const deployMauve_1 = require("./deployMauve");
const deployPool_1 = require("./deployPool");
const mintPosition_1 = require("./mintPosition");
const performSwap_1 = require("./performSwap");
const getQuote_1 = require("./getQuote");
const constants_1 = require("../src/util/constants");
const encodePriceSqrt_1 = require("../src/util/encodePriceSqrt");
const utils_1 = require("ethers/lib/utils");
const approveContractsToSpend_1 = require("../src/util/approveContractsToSpend");
async function main() {
    // Get all signers
    const signers = await hardhat_1.ethers.getSigners();
    const [deployer, mauveOwner, poolAdmin, eatSigner, liquidityProvider, trader, trader2,] = signers;
    // Deploy EATVerifier
    const EATVerifier = await (0, deployEAT_1.deployEAT)(deployer, eatSigner);
    // Deploy ERC20 tokens
    const [token0, token1] = await (0, deployERC20s_1.deployERC20s)();
    // mint erc20s
    await token0.connect(liquidityProvider).mint((0, utils_1.parseEther)("1000000000000000"));
    await token1.connect(liquidityProvider).mint((0, utils_1.parseEther)("1000000000000000"));
    await token0.connect(trader).mint((0, utils_1.parseEther)("1000000000000000"));
    await token1.connect(trader).mint((0, utils_1.parseEther)("1000000000000000"));
    const { factory, router02, quoter, positionManager } = await (0, deployMauve_1.deployMauve)(deployer, mauveOwner, poolAdmin, EATVerifier);
    console.log(`Factory: ${factory.address}`);
    console.log(`Router: ${router02.address}`);
    console.log(`Quoter: ${quoter.address}`);
    console.log(`NFT Position manager: ${positionManager.address}`);
    console.log("Mauve deployed");
    const poolAddress = await (0, deployPool_1.deployPool)(poolAdmin, factory.address, token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
    await (0, approveContractsToSpend_1.approveContractsToSpend)([token0, token1], liquidityProvider, [
        positionManager.address,
        router02.address,
        poolAddress,
    ]);
    await (0, approveContractsToSpend_1.approveContractsToSpend)([token0, token1], trader, [
        positionManager.address,
        router02.address,
        poolAddress,
    ]);
    const domain = {
        name: "Ethereum Access Token",
        version: "1",
        chainId: await deployer.getChainId(),
        verifyingContract: EATVerifier.address,
    };
    const lpNFTId = await (0, mintPosition_1.mintPosition)(positionManager, [token0, token1], liquidityProvider, trader, eatSigner, domain);
    const trade = {
        tokenIn: token0.address,
        tokenOut: token1.address,
        fee: constants_1.FeeAmount.MEDIUM,
        amount: constants_1.MaxUint128,
        sqrtPriceLimit: (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102),
    };
    const quote = await (0, getQuote_1.getQuote)(quoter, getQuote_1.TradeType.EXACT_INPUT_SINGLE, trade);
    console.log(quote);
    const swap = {
        tokenIn: token0.address,
        tokenOut: token1.address,
        amountIn: 3,
        amountOutMinimum: 1,
        recipient: trader.address,
        fee: constants_1.FeeAmount.MEDIUM,
    };
    await (0, performSwap_1.performSwap)(router02, swap, trader, eatSigner, domain);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
