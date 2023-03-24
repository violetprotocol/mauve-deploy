import { BigNumber, Contract } from "ethers";
import { FeeAmount } from "../src/util/constants";

export enum TradeType {
  EXACT_INPUT = "exactInput",
  EXACT_INPUT_SINGLE = "exactInputSingle",
  EXACT_OUTPUT = "exactOutput",
  EXACT_OUTPUT_SINGLE = "exactOutputSingle",
}

export interface TradeSingleHop {
  tokenIn: string;
  tokenOut: string;
  fee: FeeAmount;
  amount: BigNumber;
  sqrtPriceLimit: BigNumber;
}

export interface TradeMultiHop {
  path: TradeSingleHop[];
  amount: BigNumber;
}

export async function getQuote(
  quoter: Contract,
  tradeType: TradeType,
  trade: TradeSingleHop | TradeMultiHop
): Promise<BigNumber> {
  if (tradeType.includes("Single")) {
    const singleHop = (trade as any) as TradeSingleHop;
    return await quoter[`quoteE${tradeType.substring(1)}`](
      singleHop.tokenIn,
      singleHop.tokenOut,
      singleHop.fee,
      singleHop.amount,
      singleHop.sqrtPriceLimit
    );
  } else {
    const multiHop = (trade as any) as TradeMultiHop;
    return await quoter[`quoteE${tradeType.substring(1)}`](
      multiHop.path,
      multiHop.amount
    );
  }
}
