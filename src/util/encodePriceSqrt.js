"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePriceSqrt = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
bignumber_js_1.default.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
// returns the sqrt price as a 64x96
function encodePriceSqrt(reserve1, reserve0) {
    return ethers_1.BigNumber.from(new bignumber_js_1.default(reserve1.toString())
        .div(reserve0.toString())
        .sqrt()
        .multipliedBy(new bignumber_js_1.default(2).pow(96))
        .integerValue(3)
        .toString());
}
exports.encodePriceSqrt = encodePriceSqrt;
