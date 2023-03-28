"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessTokenForMulticallWithDeadline = exports.generateAccessTokenForMulticall = exports.generateAccessToken = void 0;
const ethers_1 = require("ethers");
const ethereum_access_token_helpers_1 = require("@violetprotocol/ethereum-access-token-helpers");
// import { EATMulticall } from '../../typechain'
const utils_1 = require("ethers/lib/utils");
const generateAccessToken = async (signer, domain, functionName, caller, 
// contract: EATMulticall,
contract, parameters, expiry) => {
    const token = {
        functionCall: {
            functionSignature: contract.interface.getSighash(functionName),
            target: ethers_1.ethers.utils.getAddress(contract.address),
            caller: ethers_1.ethers.utils.getAddress(caller.address),
            parameters: ethereum_access_token_helpers_1.utils.packParameters(contract.interface, functionName, parameters),
        },
        expiry: expiry || ethers_1.BigNumber.from(4833857428),
    };
    const eat = (0, utils_1.splitSignature)(await ethereum_access_token_helpers_1.utils.signAccessToken(signer, domain, token));
    return { eat, expiry: token.expiry };
};
exports.generateAccessToken = generateAccessToken;
const generateAccessTokenForMulticall = async (signer, domain, caller, 
// contract: EATMulticall,
contract, parameters, expiry) => {
    const token = {
        functionCall: {
            functionSignature: contract.interface.getSighash("multicall(uint8,bytes32,bytes32,uint256,bytes[])"),
            target: ethers_1.ethers.utils.getAddress(contract.address),
            caller: ethers_1.ethers.utils.getAddress(caller.address),
            parameters: ethereum_access_token_helpers_1.utils.packParameters(contract.interface, "multicall(uint8,bytes32,bytes32,uint256,bytes[])", [parameters]),
        },
        expiry: expiry || ethers_1.BigNumber.from(4833857428),
    };
    const eat = (0, utils_1.splitSignature)(await ethereum_access_token_helpers_1.utils.signAccessToken(signer, domain, token));
    return { eat, expiry: token.expiry };
};
exports.generateAccessTokenForMulticall = generateAccessTokenForMulticall;
const generateAccessTokenForMulticallWithDeadline = async (signer, domain, caller, 
// contract: EATMulticall,
contract, parameters, expiry) => {
    const token = {
        functionCall: {
            functionSignature: contract.interface.getSighash("multicall(uint8,bytes32,bytes32,uint256,uint256,bytes[])"),
            target: ethers_1.ethers.utils.getAddress(contract.address),
            caller: ethers_1.ethers.utils.getAddress(caller.address),
            parameters: ethereum_access_token_helpers_1.utils.packParameters(contract.interface, "multicall(uint8,bytes32,bytes32,uint256,uint256,bytes[])", parameters),
        },
        expiry: expiry || ethers_1.BigNumber.from(4833857428),
    };
    const eat = (0, utils_1.splitSignature)(await ethereum_access_token_helpers_1.utils.signAccessToken(signer, domain, token));
    return { eat, expiry: token.expiry };
};
exports.generateAccessTokenForMulticallWithDeadline = generateAccessTokenForMulticallWithDeadline;
