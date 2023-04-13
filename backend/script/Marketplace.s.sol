// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/Marketplace.sol";

contract DeployMarketplace is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address reservNftAddress = 0x3F79Ec9a375E1583626Dae0B7bb6B2e0aB1b33d1;

        new Marketplace(reservNftAddress);

        vm.stopBroadcast();
    }
}
