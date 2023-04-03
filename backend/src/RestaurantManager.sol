// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract RestaurantManager {
    struct Restaurant {
        address owner;
        string name;
        string location;
    }

    event RestaurantRegistered(
        address indexed owner,
        string indexed name,
        string indexed location
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
            location: location
        });
        _restaurantCounter.increment();

        emit RestaurantRegistered(msg.sender, name, location);
    }

    function getRestaurant(
        uint256 restaurantId
    ) public view returns (Restaurant memory) {
        return restaurants[restaurantId];
    }

    function getAllRestaurants() public view returns (Restaurant[] memory) {
        uint256 numOfRestaurants = _restaurantCounter.current();
        Restaurant[] memory allRestaurants = new Restaurant[](numOfRestaurants);

        for (uint256 i = 0; i < numOfRestaurants; i++) {
            allRestaurants[i] = restaurants[i];
        }

        return allRestaurants;
    }
}
