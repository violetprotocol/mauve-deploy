import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";
import { BigNumber, Contract } from "ethers";
import { mint } from "../src/util/mint";

export async function mintPosition(
  positionManager: Contract,
  tokens: Contract[],
  minter: SignerWithAddress,
  eatSigner: SignerWithAddress,
  domain: Domain
): Promise<number> {
  const mintResult = await mint(
    positionManager,
    tokens,
    minter,
    eatSigner,
    domain
  );

  return mintResult.tokenId;
}
