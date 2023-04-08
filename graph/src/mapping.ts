import {
  RestaurantToggleActive as RestaurantToggleActiveEvent,
  RestaurantRegistered as RestaurantRegisteredEvent,
  DropCreated as DropCreatedEvent,
  DropToggleActive as DropToggleActiveEvent,
} from "../generated/RestaurantManager/RestaurantManager"

import { Restaurant, Drop } from "../generated/schema"
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

export function handleDropCreated(event: DropCreatedEvent): void {
  
    let drop = new Drop(event.params.dropId.toHex())
  
    drop.dropId = BigInt.fromI32(event.params.dropId.toI32())
    drop.restaurantId = event.params.restaurantId
    drop.mintPrice = event.params.mintPrice
    drop.startDate = event.params.startDate
    drop.endDate = event.params.endDate
    drop.dailyStartTime = event.params.dailyStartTime
    drop.dailyEndTime = event.params.dailyEndTime
    drop.windowDuration = event.params.windowDuration
    drop.reservationsPerWindow = BigInt.fromI32(event.params.reservationsPerWindow)
    drop.isActive = true
    drop.save()
}

export function handleDropToggleActive(event: DropToggleActiveEvent): void {

  let drop = Drop.load(event.params.dropId.toHex())

  if (drop == null) {
    drop = new Drop(event.params.dropId.toHex())
  }

  drop.isActive = event.params.isActive;
  drop.save()
}
