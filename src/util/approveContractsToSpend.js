"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveContractsToSpend = void 0;
const ethers_1 = require("ethers");
const approveContractsToSpend = async (tokens, owner, addressToApprove) => {
    await tokens.forEach(async (token) => {
        addressToApprove.forEach(async (address) => await token
            .connect(owner)
            .approve(address, ethers_1.ethers.constants.MaxUint256.div(10)));
    });
};
exports.approveContractsToSpend = approveContractsToSpend;
