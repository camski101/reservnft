// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/RestaurantManager.sol";

contract RestaurantManagerTest is Test {
    RestaurantManager restaurantManager;

    function setUp() public {
        restaurantManager = new RestaurantManager();
    }

    function test_RegisterRestaurant() public {
        restaurantManager.registerRestaurant(
            "Hungry Hippos",
            "123 Main St, New York, NY 10001"
        );

        RestaurantManager.Restaurant memory res = restaurantManager
            .getRestaurant(0);

        assertEq(
            res.name,
            "Hungry Hippos",
            "Restaurant name should be Hungry Hippos"
        );

        assertEq(
            res.businessAddress,
            "123 Main St, New York, NY 10001",
            "Restaurant location should be 123 Main St, New York, NY 10001"
        );

        assertEq(
            res.owner,
            address(this),
            "Restaurant owner should be the address of the test contract"
        );
    }

    function test_GetAllRestaurants() public {
        restaurantManager.registerRestaurant(
            "Hungry Hippos",
            "123 Main St, New York, NY 10001"
        );
        restaurantManager.registerRestaurant(
            "Meaty Meatballs",
            "125 Main St, New York, NY 10001"
        );

        RestaurantManager.Restaurant[] memory rests = restaurantManager
            .getAllRestaurants();

        assertEq(rests.length, 2, "There should be two restaurants");
    }

    function test_DeactivateRestaurant() public {
        restaurantManager.registerRestaurant(
            "Hungry Hippos",
            "123 Main St, New York, NY 10001"
        );

        restaurantManager.deactivateRestaurant(0);

        RestaurantManager.Restaurant[] memory rests = restaurantManager
            .getAllRestaurants();

        assertEq(rests.length, 0, "There should be zero active restaurants");
    }

    function test_RevertWhen_DeactivateRestaurantByNonOwner() public {
        restaurantManager.registerRestaurant(
            "Hungry Hippos",
            "123 Main St, New York, NY 10001"
        );

        vm.prank(address(0x1234));

        vm.expectRevert(RestaurantManager__Unauthorized.selector);

        restaurantManager.deactivateRestaurant(0);
    }
}
