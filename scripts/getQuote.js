"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuote = exports.TradeType = void 0;
var TradeType;
(function (TradeType) {
    TradeType["EXACT_INPUT"] = "exactInput";
    TradeType["EXACT_INPUT_SINGLE"] = "exactInputSingle";
    TradeType["EXACT_OUTPUT"] = "exactOutput";
    TradeType["EXACT_OUTPUT_SINGLE"] = "exactOutputSingle";
})(TradeType = exports.TradeType || (exports.TradeType = {}));
async function getQuote(quoter, tradeType, trade) {
    if (tradeType.includes("Single")) {
        const singleHop = trade;
        return await quoter.callStatic[`quoteE${tradeType.substring(1)}`](singleHop.tokenIn, singleHop.tokenOut, singleHop.fee, singleHop.amount, singleHop.sqrtPriceLimit);
    }
    else {
        const multiHop = trade;
        return await quoter.callStatic[`quoteE${tradeType.substring(1)}`](multiHop.path, multiHop.amount);
    }
}
exports.getQuote = getQuote;
