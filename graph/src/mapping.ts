import {
  RestaurantIsActive as RestaurantIsActiveEvent,
  RestaurantRegistered as RestaurantRegisteredEvent,
  DropCreated as DropCreatedEvent,
  DropIsActive as DropIsActiveEvent,
} from "../generated/RestaurantManager/RestaurantManager"

import { ReservationCreated as ReservationCreatedEvent } from "../generated/ReservNFT/ReservNFT"    
import {
  ReservationListed as ReservationListedEvent, 
  ReservationBought as ReservationBoughtEvent, 
  ReservationCancelled as ReservationCancelledEvent
} from "../generated/Marketplace/Marketplace"

import { Restaurant, Drop, Reservation, Listing } from "../generated/schema"
import { BigInt, Address } from "@graphprotocol/graph-ts";

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
  reservation.status = "owned";

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

export function handleReservationListed(event: ReservationListedEvent): void {

  let listing = new Listing(event.params.tokenId.toHex() + event.params.seller.toHex())
  let reservation = Reservation.load(event.params.tokenId.toHex())

  if (reservation == null) {
    reservation = new Reservation(event.params.tokenId.toHex())
  }

  listing.tokenId = event.params.tokenId
  listing.seller = event.params.seller
  listing.buyer = Address.fromString("0x0000000000000000000000000000000000000000")
  listing.price = event.params.price
  listing.reservation = reservation.id
  reservation.status = "listed";

  listing.save()
  reservation.save()
}
export function handleReservationBought(event: ReservationBoughtEvent): void {

  let reservation = Reservation.load(event.params.tokenId.toHex())
  let listing = Listing.load(event.params.tokenId.toHex() + event.params.seller.toHex())
  if (reservation == null) {
    reservation = new Reservation(event.params.tokenId.toHex())
  }

  if (listing == null) {
    listing = new Listing(event.params.tokenId.toHex() + event.params.seller.toHex())
  }

  listing.buyer = event.params.buyer
  reservation.owner = event.params.buyer;
  reservation.status = "owned";

  listing.save()
  reservation.save()

}
export function handleReservationCancelled(event: ReservationCancelledEvent): void {
  let reservation = Reservation.load(event.params.tokenId.toHex())
  let listing = Listing.load(event.params.tokenId.toHex() + event.params.seller.toHex())
  if (reservation == null) {
    reservation = new Reservation(event.params.tokenId.toHex())
  }

  if (listing == null) {
    listing = new Listing(event.params.tokenId.toHex() + event.params.seller.toHex())
  }

  listing!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  reservation.status = "owned";

  listing!.save()
  reservation.save()
}




