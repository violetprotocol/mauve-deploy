"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintPosition = void 0;
const mint_1 = require("../src/util/mint");
async function mintPosition(positionManager, tokens, minter, receiver, eatSigner, domain) {
    const mintResult = await (0, mint_1.mint)(positionManager, tokens, minter, receiver, eatSigner, domain);
    return mintResult.tokenId;
}
exports.mintPosition = mintPosition;
