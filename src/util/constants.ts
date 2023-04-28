import { BigNumber } from 'ethers'

export const MaxUint128 = BigNumber.from(2).pow(128).sub(1)

export enum FeeAmount {
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
}

export const VIOLET_ID_ADDRESS = "0xB4960F218798c3479E25B0cCc707335216991Fef"
