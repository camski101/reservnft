// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

error RestaurantManager__Unauthorized();

contract RestaurantManager {
    struct Restaurant {
        address owner;
        string name;
        string location;
        bool isActive;
    }

    event RestaurantRegistered(
        address indexed owner,
        string indexed name,
        string indexed location
    );

    event RestaurantDeactivated(
        address indexed owner,
        uint256 indexed restaurantId
    );

    using Counters for Counters.Counter;

    Counters.Counter private _restaurantCounter;

    mapping(uint256 => Restaurant) public restaurants;

    function registerRestaurant(
        string calldata name,
        string calldata location
    ) public {
        uint256 restaurantId = _restaurantCounter.current();
        restaurants[restaurantId] = Restaurant({
            owner: msg.sender,
            name: name,
            location: location,
            isActive: true
        });
        _restaurantCounter.increment();

        emit RestaurantRegistered(msg.sender, name, location);
    }

    function deactivateRestaurant(uint256 restaurantId) public {
        if (msg.sender != restaurants[restaurantId].owner) {
            revert RestaurantManager__Unauthorized();
        }
        restaurants[restaurantId].isActive = false;

        emit RestaurantDeactivated(msg.sender, restaurantId);
    }

    function getRestaurant(
        uint256 restaurantId
    ) public view returns (Restaurant memory) {
        return restaurants[restaurantId];
    }

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
