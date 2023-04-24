"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxLiquidityPerTick = exports.getMaxTick = exports.getMinTick = void 0;
const ethers_1 = require("ethers");
const getMinTick = (tickSpacing) => Math.ceil(-887272 / tickSpacing) * tickSpacing;
exports.getMinTick = getMinTick;
const getMaxTick = (tickSpacing) => Math.floor(887272 / tickSpacing) * tickSpacing;
exports.getMaxTick = getMaxTick;
const getMaxLiquidityPerTick = (tickSpacing) => ethers_1.BigNumber.from(2)
    .pow(128)
    .sub(1)
    .div(((0, exports.getMaxTick)(tickSpacing) - (0, exports.getMinTick)(tickSpacing)) / tickSpacing + 1);
exports.getMaxLiquidityPerTick = getMaxLiquidityPerTick;
