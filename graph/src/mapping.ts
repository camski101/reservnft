import {
  RestaurantDeactivated as RestaurantDeactivatedEvent,
  RestaurantRegistered as RestaurantRegisteredEvent
} from "../generated/RestaurantManager/RestaurantManager"

import { RestaurantDeactivated, RestaurantRegistered } from "../generated/schema"

export function handleRestaurantDeactivated(event: RestaurantRegisteredEvent): void {

  let restaurantDeactivated = RestaurantDeactivated.load(event.params.restaurantAddress.toHex())
  )

  restaurantDeactivated.restaurantAddress = event.params.restaurantAddress
  restaurantDeactivated.save()
}

export function handleRestaurantRegistered(event: RestaurantRegisteredEvent): void {}
