import {
  RestaurantToggleActive as RestaurantToggleActiveEvent,
  RestaurantRegistered as RestaurantRegisteredEvent
} from "../generated/RestaurantManager/RestaurantManager"

import { Restaurant } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts";


export function handleRestaurantRegistered(event: RestaurantRegisteredEvent): void {

  let restaurant = new Restaurant(event.params.restaurantId.toHex())

  restaurant.restaurantId = BigInt.fromI32(event.params.restaurantId.toI32())
  restaurant.owner = event.params.owner
  restaurant.name = event.params.name
  restaurant.businessAddress = event.params.businessAddress
  restaurant.isActive = true
  restaurant.save()
}

export function handleRestaurantToggleActive(event: RestaurantToggleActiveEvent): void {

  let restaurant = Restaurant.load(event.params.restaurantId.toHex())

  if (restaurant == null) {
    restaurant = new Restaurant(event.params.restaurantId.toHex())
  }
  
  restaurant.isActive = event.params.isActive;
  restaurant.save()
}

