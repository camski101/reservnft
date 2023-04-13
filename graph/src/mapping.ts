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
  
    drop.restaurantId = event.params.restaurantId.toHex()
    drop.mintPrice = event.params.mintPrice
    drop.startDate = event.params.startDate
    drop.endDate = event.params.endDate
    drop.dailyStartTime = event.params.dailyStartTime
    drop.dailyEndTime = event.params.dailyEndTime
    drop.windowDuration = event.params.windowDuration
    drop.reservationsPerWindow = BigInt.fromI32(event.params.reservationsPerWindow)
  
    drop.isActive = true

    let restaurant = Restaurant.load(drop.restaurantId);
  if (restaurant != null) {
    // Set the restaurant field
    drop.restaurant = restaurant.id;
  }
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
  reservation.owner = event.params.owner
  reservation.restaurantId = event.params.restaurantId.toHex()
  reservation.dropId = event.params.dropId.toHex()
  reservation.reservationTimestamp = event.params.reservationTimestamp

  let restaurant = Restaurant.load(event.params.restaurantId.toHex());
  if (restaurant != null) {
    // Set the restaurant field
    reservation.restaurant = restaurant.id;
  }

  let drop = Drop.load(event.params.dropId.toHex());
  if (drop != null) {
    // Set the drop field
    reservation.drop = drop.id;
  }
  reservation.save()

}


