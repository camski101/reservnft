import {
  RestaurantDeactivated as RestaurantDeactivatedEvent,
  RestaurantRegistered as RestaurantRegisteredEvent
} from "../generated/RestaurantManager/RestaurantManager"

import { Restaurant } from "../generated/schema"

export function handleRestaurantRegistered(event: RestaurantRegisteredEvent): void {

  let restaurant = new Restaurant(event.params.restaurantId.toHex())

  restaurant.owner = event.params.owner
  restaurant.name = event.params.name
  restaurant.businessAddress = event.params.businessAddress
  restaurant.isActive = event.params.isActive
  restaurant.save()
}

export function handleRestaurantDeactivated(event: RestaurantDeactivatedEvent): void {

  let restaurant = Restaurant.load(event.params.restaurantId.toHex())

  if (restaurant == null) {
    restaurant = new Restaurant(event.params.restaurantId.toHex())
  }

  restaurant.owner = event.params.owner;
  restaurant.id  = event.params.restaurantId.toHex();
  restaurant.save()
}

