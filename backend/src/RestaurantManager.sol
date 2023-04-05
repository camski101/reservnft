// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

error RestaurantManager__Unauthorized();

/// @title RestaurantManager
/// @notice Register and manage restaurants
contract RestaurantManager {
    /// @dev Restaurant struct stores restaurant information
    struct Restaurant {
        address owner;
        string name;
        string businessAddress;
        bool isActive;
    }

    /// @notice Emitted when a restaurant is registered
    event RestaurantRegistered(
        uint256 indexed restaurantId,
        address indexed owner,
        string indexed name,
        string businessAddress,
        bool isActive
    );

    /// @notice Emitted when a restaurant is deactivated
    event RestaurantDeactivated(
        address indexed owner,
        uint256 indexed restaurantId
    );

    using Counters for Counters.Counter;

    Counters.Counter private _restaurantCounter;

    mapping(uint256 => Restaurant) public restaurants;

    /// @notice Register a restaurant
    /// @param name Restaurant name
    /// @param businessAddress Restaurant location
    function registerRestaurant(
        string calldata name,
        string calldata businessAddress
    ) public {
        uint256 restaurantId = _restaurantCounter.current();
        restaurants[restaurantId] = Restaurant({
            owner: msg.sender,
            name: name,
            businessAddress: businessAddress,
            isActive: true
        });
        _restaurantCounter.increment();

        emit RestaurantRegistered(
            restaurantId,
            msg.sender,
            name,
            businessAddress,
            true
        );
    }

    /// @notice Deactivate a restaurant by its ID
    /// @param restaurantId Restaurant ID
    function deactivateRestaurant(uint256 restaurantId) public {
        if (msg.sender != restaurants[restaurantId].owner) {
            revert RestaurantManager__Unauthorized();
        }
        restaurants[restaurantId].isActive = false;

        emit RestaurantDeactivated(msg.sender, restaurantId);
    }

    /// @notice Get a restaurant by its ID
    /// @param restaurantId Restaurant ID
    /// @return Restaurant struct
    function getRestaurant(
        uint256 restaurantId
    ) public view returns (Restaurant memory) {
        return restaurants[restaurantId];
    }

    /// @notice Get all active restaurants
    /// @return Array of Restaurant structs
    function getAllRestaurants() public view returns (Restaurant[] memory) {
        uint256 activeRestaurants = 0;
        for (uint256 i = 0; i < _restaurantCounter.current(); i++) {
            if (restaurants[i].isActive) {
                activeRestaurants++;
            }
        }

        Restaurant[] memory restaurantList = new Restaurant[](
            activeRestaurants
        );
        uint256 index = 0;
        for (uint256 i = 0; i < _restaurantCounter.current(); i++) {
            if (restaurants[i].isActive) {
                restaurantList[index] = restaurants[i];
                index++;
            }
        }

        return restaurantList;
    }
}
