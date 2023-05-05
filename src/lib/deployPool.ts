import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { FeeAmount } from "../util/constants";
import { createAndInitializePoolIfNecessary } from "../util/createAndInitializePoolIfNecessary";

export async function deployPool(
  deployer: SignerWithAddress,
  factoryAddress: string,
  token0Address: string,
  token1Address: string,
  fee: FeeAmount,
  initialSqrtPrice: string
) {
  const poolAddress = await createAndInitializePoolIfNecessary(
    deployer,
    factoryAddress,
    token0Address,
    token1Address,
    fee,
    initialSqrtPrice
  );

  return poolAddress;
}
