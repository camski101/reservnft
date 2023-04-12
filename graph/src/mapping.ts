import {
  RestaurantIsActive as RestaurantIsActiveEvent,
  RestaurantRegistered as RestaurantRegisteredEvent,
  DropCreated as DropCreatedEvent,
  DropIsActive as DropIsActiveEvent,
} from "../generated/RestaurantManager/RestaurantManager"

import { Restaurant, Drop, Reservation } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts";

import { ReservationCreated as ReservationCreatedEvent } from "../generated/ReservNFT/ReservNFT"    

export function handleRestaurantRegistered(event: RestaurantRegisteredEvent): void {

  let restaurant = new Restaurant(event.params.restaurantId.toHex())

  restaurant.restaurantId = BigInt.fromI32(event.params.restaurantId.toI32())
  restaurant.owner = event.params.owner
  restaurant.name = event.params.name
  restaurant.businessAddress = event.params.businessAddress
  restaurant.isActive = true
  restaurant.save()
}

export function handleRestaurantIsActive(event: RestaurantIsActiveEvent): void {

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

export function handleDropIsActive(event: DropIsActiveEvent): void {

  let drop = Drop.load(event.params.dropId.toHex())

  if (drop == null) {
    drop = new Drop(event.params.dropId.toHex())
  }

  drop.isActive = event.params.isActive;
  drop.save()
}

export function handleReservationCreated(event: ReservationCreatedEvent): void {
  let reservation = new Reservation(event.params.tokenId.toHex())
  reservation.tokenId = event.params.tokenId
  reservation.restaurantId = event.params.restaurantId
  reservation.dropId = event.params.dropId
  reservation.reservationTimestamp = event.params.reservationTimestamp
  reservation.save()
}


