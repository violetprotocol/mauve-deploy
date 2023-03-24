import { BigNumber, Contract } from "ethers";

export enum TradeType {
  EXACT_INPUT = "exactInput",
  EXACT_INPUT_SINGLE = "exactInputSingle",
  EXACT_OUTPUT = "exactOutput",
  EXACT_OUTPUT_SINGLE = "exactOutputSingle",
}

export async function getQuote(
  quoter: Contract,
  tradeType: TradeType,
  trade: any
): Promise<BigNumber> {
  if (tradeType.includes("single")) {
    return await quoter[tradeType](
      trade.tokenIn,
      trade.tokenOut,
      trade.fee,
      trade.amountIn,
      trade.sqrtPriceLimit
    );
  } else {
    return await quoter[tradeType](trade.path, trade.amountIn);
  }
}
