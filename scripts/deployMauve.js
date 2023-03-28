"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployMauve = void 0;
const MauveDeployer_1 = require("../src/deployer/MauveDeployer");
const roles_1 = require("../src/util/roles");
async function deployMauve(deployer, mauveOwner, poolAdmin, EATVerifier) {
    const { factory, router02, quoter, positionManager, } = await MauveDeployer_1.MauveDeployer.deploy(deployer, EATVerifier.address);
    await factory
        .connect(deployer)
        .setRole(mauveOwner.address, roles_1.ownerBytes32);
    await factory
        .connect(mauveOwner)
        .setRole(poolAdmin.address, roles_1.poolAdminBytes32);
    return { factory, router02, quoter, positionManager };
}
exports.deployMauve = deployMauve;
