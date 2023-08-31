import { Signer, Contract, ContractFactory } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { linkLibraries } from "../util/linkLibraries";
import { positionManagerBytes32, swapRouterBytes32 } from "../util/roles";
import WETH9 from "../util/WETH9.json";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  MauveFactory: require("@violetprotocol/mauve-core/artifacts/contracts/MauveFactory.sol/MauveFactory.json"),
  Quoter: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/lens/Quoter.sol/Quoter.json"),
  QuoterV2: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"),
  MauveSwapRouter: require("@violetprotocol/mauve-swap-router-contracts/artifacts/contracts/MauveSwapRouter.sol/MauveSwapRouter.json"),
  NFTDescriptor: require("@violetprotocol/mauve-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
  NonfungibleTokenPositionDescriptor: require("@violetprotocol/mauve-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
  NonfungiblePositionManager: require("@violetprotocol/mauve-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  MauveInterfaceMulticall: require("@violetprotocol/mauve-periphery/artifacts/contracts/lens/MauveInterfaceMulticall.sol/MauveInterfaceMulticall.json"),
  WETH9,
};

// TODO: Should replace these with the proper typechain output.
// type INonfungiblePositionManager = Contract;
// type IMauveFactory = Contract;

export class MauveDeployer {
  static async deploy(
    hre: HardhatRuntimeEnvironment,
    actor: Signer,
    violetIdAddress: string,
    eatVerifierAddress: string,
    WETH9Address: string
  ): Promise<{ [name: string]: Contract }> {
    const deployer = new MauveDeployer(hre, actor);

    const factory = await deployer.deployFactory();
    console.log(`Factory deployed at: ${factory.address}`);
    const quoter = await deployer.deployQuoter(factory.address, WETH9Address);
    console.log(`Quoter deployed at: ${quoter.address}`);
    const quoterV2 = await deployer.deployQuoterV2(
      factory.address,
      WETH9Address
    );
    console.log(`QuoterV2 deployed at: ${quoterV2.address}`);
    const nftDescriptorLibrary = await deployer.deployNFTDescriptorLibrary();
    console.log(
      `NFTDescriptorLibrary deployed at: ${nftDescriptorLibrary.address}`
    );
    const positionDescriptor = await deployer.deployPositionDescriptor(
      nftDescriptorLibrary.address,
      WETH9Address
    );
    console.log(
      `NFTPositionDescriptor deployed at: ${positionDescriptor.address}`
    );
    const positionManager = await deployer.deployNonfungiblePositionManager(
      factory.address,
      WETH9Address,
      positionDescriptor.address,
      eatVerifierAddress,
      violetIdAddress
    );
    console.log(`NFTPositionManager deployed at: ${positionManager.address}`);

    const mauveSwapRouter = await deployer.deployMauveSwapRouter(
      factory.address,
      positionManager.address,
      WETH9Address,
      eatVerifierAddress
    );
    console.log(`MauveSwapRouter deployed at: ${mauveSwapRouter.address}`);

    console.log(
      `Assigning Swap Router role to (${mauveSwapRouter.address})...`
    );
    await factory.setRole(mauveSwapRouter.address, swapRouterBytes32);
    console.log(`✅ Swap Router role assigned.`);

    console.log(
      `Assigning Position Manager role to (${positionManager.address})...`
    );
    await factory.setRole(positionManager.address, positionManagerBytes32);
    console.log(`✅ Position Manager role assigned.`);

    return {
      factory,
      mauveSwapRouter,
      quoter,
      quoterV2,
      nftDescriptorLibrary,
      positionDescriptor,
      positionManager,
    };
  }

  hre: HardhatRuntimeEnvironment;
  deployer: Signer;

  constructor(hre: HardhatRuntimeEnvironment, deployer: Signer) {
    this.hre = hre;
    this.deployer = deployer;
  }

  async deployFactory() {
    return await this.deployContract<Contract>(
      artifacts.MauveFactory.abi,
      artifacts.MauveFactory.bytecode,
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

  async deployMauveSwapRouter(
    factoryV3Address: string,
    positionManagerAddress: string,
    weth9Address: string,
    eatVerifierAddress: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.MauveSwapRouter.abi,
      artifacts.MauveSwapRouter.bytecode,
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

  async deployMauveInterfaceMulticall() {
    return await this.deployContract<Contract>(
      artifacts.MauveInterfaceMulticall.abi,
      artifacts.MauveInterfaceMulticall.bytecode,
      [],
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
                start: 1657, // old value is 1261
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
      this.deployer,
      { NFTDescriptor: nftDescriptorLibraryAddress }
    )) as Contract;
  }

  async deployNonfungiblePositionManager(
    factoryAddress: string,
    weth9Address: string,
    positionDescriptorAddress: string,
    EATVerifierAddress: string,
    violetIdAddress: string
  ) {
    return await this.deployContract<Contract>(
      artifacts.NonfungiblePositionManager.abi,
      artifacts.NonfungiblePositionManager.bytecode,
      [
        factoryAddress,
        weth9Address,
        positionDescriptorAddress,
        EATVerifierAddress,
        violetIdAddress,
      ],
      this.deployer
    );
  }

  private async deployContract<T>(
    abi: any,
    bytecode: string,
    deployParams: Array<any>,
    actor: Signer,
    libraries?: Record<string, string>
  ) {
    console.log(`------------`);
    console.log(`Deploying contract...`);

    const factory = new ContractFactory(abi, bytecode, actor);
    const contract = await factory.deploy(...deployParams);

    console.log(`🚀 Contract deployed! Waiting for 5 confirmations...`);
    await contract.deployTransaction.wait(5);

    try {
      await this.hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: deployParams,
        libraries,
      });
    } catch (error) {
      console.log(
        `Error verifying contract at address ${contract.address}: ${error}`
      );
    }

    console.log(`✅ Done deploying contract.`);
    return contract;
  }
}
