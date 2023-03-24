import { Signer, Contract, ContractFactory } from "ethers";
import { linkLibraries } from "../util/linkLibraries";
import { positionManagerBytes32, swapRouterBytes32 } from "../util/roles";
import WETH9 from "../util/WETH9.json";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  UniswapV3Factory: require("@violetprotocol/mauve-v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  Quoter: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/lens/Quoter.sol/Quoter.json"),
  QuoterV2: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"),
  SwapRouter: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
  SwapRouter02: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/SwapRouter02.sol/SwapRouter02.json"),
  NFTDescriptor: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@violetprotocol/mauve-v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  WETH9,
};

// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IUniswapV3Factory = Contract;

const WETH9Address = "0x4200000000000000000000000000000000000006";

export class MauveDeployer {
  static async deploy(
    actor: Signer,
    eatVerifierAddress: string
  ): Promise<{ [name: string]: Contract }> {
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
    const positionDescriptor = await deployer.deployPositionDescriptor(
      nftDescriptorLibrary.address,
      WETH9Address
    );
    const positionManager = await deployer.deployNonfungiblePositionManager(
      factory.address,
      WETH9Address,
      positionDescriptor.address,
      eatVerifierAddress
    );

    const router02 = await deployer.deployRouter02(
      factory.address,
      positionManager.address,
      WETH9Address,
      eatVerifierAddress
    );

    await factory.setRole(router02.address, swapRouterBytes32);
    await factory.setRole(positionManager.address, positionManagerBytes32);

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

  deployer: Signer;

  constructor(deployer: Signer) {
    this.deployer = deployer;
  }

  async deployFactory() {
    return await this.deployContract<Contract>(
      artifacts.UniswapV3Factory.abi,
      artifacts.UniswapV3Factory.bytecode,
      [],
      this.deployer
    );
  }

  async deployWETH9() {
    return await this.deployContract<Contract>(
      artifacts.WETH9.abi,
      artifacts.WETH9.bytecode,
      [],
      this.deployer
    );
  }

  async deployRouter(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.SwapRouter.abi,
      artifacts.SwapRouter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployRouter02(
    factoryV3Address: string,
    positionManagerAddress: string,
    weth9Address: string,
    eatVerifierAddress: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.SwapRouter02.abi,
      artifacts.SwapRouter02.bytecode,
      [
        factoryV3Address,
        positionManagerAddress,
        weth9Address,
        eatVerifierAddress,
      ],
      this.deployer
    );
  }

  async deployQuoter(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.Quoter.abi,
      artifacts.Quoter.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployQuoterV2(factoryAddress: string, weth9Address: string) {
    return await this.deployContract<Contract>(
      artifacts.QuoterV2.abi,
      artifacts.QuoterV2.bytecode,
      [factoryAddress, weth9Address],
      this.deployer
    );
  }

  async deployNFTDescriptorLibrary() {
    return await this.deployContract<Contract>(
      artifacts.NFTDescriptor.abi,
      artifacts.NFTDescriptor.bytecode,
      [],
      this.deployer
    );
  }

  async deployPositionDescriptor(
    nftDescriptorLibraryAddress: string,
    weth9Address: string
  ) {
    const linkedBytecode = linkLibraries(
      {
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
      },
      {
        NFTDescriptor: nftDescriptorLibraryAddress,
      }
    );

    return (await this.deployContract(
      artifacts.NonfungibleTokenPositionDescriptor.abi,
      linkedBytecode,
      // 'ETH' as a bytes32 string
      [
        weth9Address,
        "0x4554480000000000000000000000000000000000000000000000000000000000",
      ],
      this.deployer
    )) as Contract;
  }

  async deployNonfungiblePositionManager(
    factoryAddress: string,
    weth9Address: string,
    positionDescriptorAddress: string,
    EATVerifierAddress: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.NonfungiblePositionManager.abi,
      artifacts.NonfungiblePositionManager.bytecode,
      [
        factoryAddress,
        weth9Address,
        positionDescriptorAddress,
        EATVerifierAddress,
      ],
      this.deployer
    );
  }

  private async deployContract<T>(
    abi: any,
    bytecode: string,
    deployParams: Array<any>,
    actor: Signer
  ) {
    const factory = new ContractFactory(abi, bytecode, actor);
    return await factory.deploy(...deployParams);
  }
}
