import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Domain } from "@violetprotocol/ethereum-access-token-helpers/dist/messages";
import { Contract } from "ethers";
import { mint } from "../src/util/mint";

export async function mintPosition(
  positionManager: Contract,
  tokens: Contract[],
  minter: SignerWithAddress,
  receiver: SignerWithAddress,
  eatSigner: SignerWithAddress,
  domain: Domain
): Promise<number> {
  const mintResult = await mint(
    positionManager,
    tokens,
    minter,
    receiver,
    eatSigner,
    domain
  );

  return mintResult.tokenId;
}
