"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MauveDeployer = void 0;
const ethers_1 = require("ethers");
const linkLibraries_1 = require("../util/linkLibraries");
const roles_1 = require("../util/roles");
const WETH9_json_1 = __importDefault(require("../util/WETH9.json"));
const artifacts = {
    UniswapV3Factory: require("@violetprotocol/mauve-v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    Quoter: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/lens/Quoter.sol/Quoter.json"),
    QuoterV2: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"),
    SwapRouter: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    SwapRouter02: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/SwapRouter02.sol/SwapRouter02.json"),
    NFTDescriptor: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
    NonfungibleTokenPositionDescriptor: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
    NonfungiblePositionManager: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    WETH9: WETH9_json_1.default,
};
// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IUniswapV3Factory = Contract;
const WETH9Address = "0x4200000000000000000000000000000000000006";
class MauveDeployer {
    static async deploy(actor, eatVerifierAddress) {
        const deployer = new MauveDeployer(actor);
        // const weth9 = await deployer.deployWETH9();
        const factory = await deployer.deployFactory();
        // const router = await deployer.deployRouter(factory.address, WETH9Address);
        const quoter = await deployer.deployQuoter(factory.address, WETH9Address);
        // const quoterV2 = await deployer.deployQuoterV2(
        //   factory.address,
        //   WETH9Address
        // );
        const nftDescriptorLibrary = await deployer.deployNFTDescriptorLibrary();
        const positionDescriptor = await deployer.deployPositionDescriptor(nftDescriptorLibrary.address, WETH9Address);
        const positionManager = await deployer.deployNonfungiblePositionManager(factory.address, WETH9Address, positionDescriptor.address, eatVerifierAddress);
        const router02 = await deployer.deployRouter02(factory.address, positionManager.address, WETH9Address, eatVerifierAddress);
        await factory.setRole(router02.address, roles_1.swapRouterBytes32);
        await factory.setRole(positionManager.address, roles_1.positionManagerBytes32);
        return {
            // weth9,
            factory,
            // router,
            router02,
            quoter,
            // quoterV2,
            nftDescriptorLibrary,
            positionDescriptor,
            positionManager,
        };
    }
    constructor(deployer) {
        this.deployer = deployer;
    }
    async deployFactory() {
        return await this.deployContract(artifacts.UniswapV3Factory.abi, artifacts.UniswapV3Factory.bytecode, [], this.deployer);
    }
    async deployWETH9() {
        return await this.deployContract(artifacts.WETH9.abi, artifacts.WETH9.bytecode, [], this.deployer);
    }
    async deployRouter(factoryAddress, weth9Address) {
        return await this.deployContract(artifacts.SwapRouter.abi, artifacts.SwapRouter.bytecode, [factoryAddress, weth9Address], this.deployer);
    }
    async deployRouter02(factoryV3Address, positionManagerAddress, weth9Address, eatVerifierAddress) {
        return await this.deployContract(artifacts.SwapRouter02.abi, artifacts.SwapRouter02.bytecode, [
            factoryV3Address,
            positionManagerAddress,
            weth9Address,
            eatVerifierAddress,
        ], this.deployer);
    }
    async deployQuoter(factoryAddress, weth9Address) {
        return await this.deployContract(artifacts.Quoter.abi, artifacts.Quoter.bytecode, [factoryAddress, weth9Address], this.deployer);
    }
    async deployQuoterV2(factoryAddress, weth9Address) {
        return await this.deployContract(artifacts.QuoterV2.abi, artifacts.QuoterV2.bytecode, [factoryAddress, weth9Address], this.deployer);
    }
    async deployNFTDescriptorLibrary() {
        return await this.deployContract(artifacts.NFTDescriptor.abi, artifacts.NFTDescriptor.bytecode, [], this.deployer);
    }
    async deployPositionDescriptor(nftDescriptorLibraryAddress, weth9Address) {
        const linkedBytecode = (0, linkLibraries_1.linkLibraries)({
            bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
            linkReferences: {
                "NFTDescriptor.sol": {
                    NFTDescriptor: [
                        {
                            length: 20,
                            start: 1681, // old value is 1261
                        },
                    ],
                },
            },
        }, {
            NFTDescriptor: nftDescriptorLibraryAddress,
        });
        return (await this.deployContract(artifacts.NonfungibleTokenPositionDescriptor.abi, linkedBytecode, 
        // 'ETH' as a bytes32 string
        [
            weth9Address,
            "0x4554480000000000000000000000000000000000000000000000000000000000",
        ], this.deployer));
    }
    async deployNonfungiblePositionManager(factoryAddress, weth9Address, positionDescriptorAddress, EATVerifierAddress) {
        return await this.deployContract(artifacts.NonfungiblePositionManager.abi, artifacts.NonfungiblePositionManager.bytecode, [
            factoryAddress,
            weth9Address,
            positionDescriptorAddress,
            EATVerifierAddress,
        ], this.deployer);
    }
    async deployContract(abi, bytecode, deployParams, actor) {
        const factory = new ethers_1.ContractFactory(abi, bytecode, actor);
        return await factory.deploy(...deployParams);
    }
}
exports.MauveDeployer = MauveDeployer;
