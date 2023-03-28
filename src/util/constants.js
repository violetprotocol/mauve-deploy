"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICK_SPACINGS = exports.FeeAmount = exports.MaxUint128 = void 0;
const ethers_1 = require("ethers");
exports.MaxUint128 = ethers_1.BigNumber.from(2).pow(128).sub(1);
var FeeAmount;
(function (FeeAmount) {
    FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
    FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
    FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount = exports.FeeAmount || (exports.FeeAmount = {}));
exports.TICK_SPACINGS = {
    [FeeAmount.LOW]: 10,
    [FeeAmount.MEDIUM]: 60,
    [FeeAmount.HIGH]: 200,
};
