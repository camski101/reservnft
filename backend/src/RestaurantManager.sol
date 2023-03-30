// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";

contract RestaurantManager {
    using Counters for Counters.Counter;
    Counters.Counter private _restaurantCounter;

    struct Restaurant {
        address owner;
        string name;
        string location;
    }

    mapping(uint256 => Restaurant) public restaurants;

    function registerRestaurant(string calldata name, string calldata location) public {
        uint256 restaurantId = _restaurantCounter.current();
        restaurants[restaurantId] = Restaurant({
            owner: msg.sender,
            name: name,
            location: location
        });
        _restaurantCounter.increment();
    }

    function getRestaurant(uint256 restaurantId) public view returns (Restaurant memory) {
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
