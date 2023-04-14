import { gql } from "@apollo/client"

const GET_MY_RESTAURANTS = gql`
    query MyRestaurants($ownerAddress: Bytes!) {
        restaurants(where: { owner: $ownerAddress }, orderBy: id, orderDirection: desc) {
            id
            name
            businessAddress
            isActive
        }
    }
`

const GET_ACTIVE_RESTAURANTS = gql`
    query ActiveRestaurants {
        restaurants(where: { isActive: true }, orderBy: id, orderDirection: desc) {
            id
            name
            businessAddress
            isActive
        }
    }
`

const GET_RESTAURANT_BY_ID = gql`
    query GetRestaurantById($id: ID!) {
        restaurant(id: $id) {
            id
            name
            businessAddress
            isActive
            owner
        }
    }
`

const GET_DROPS_BY_RESTAURANT_ID = gql`
    query GetDropsByRestaurantId($restaurantId: ID!) {
        drops(where: { restaurantId: $restaurantId }) {
            id
            mintPrice
            startDate
            endDate
            dailyStartTime
            dailyEndTime
            windowDuration
            reservationsPerWindow
            restaurantId
        }
    }
`

const GET_RESERVATION_TIMESTAMP_BY_DROP_ID = gql`
    query GetReservationTimestampByDropId($dropId: ID!) {
        reservations(where: { dropId: $dropId }) {
            reservationTimestamp
        }
    }
`

const GET_RESERVATIONS_BY_ADDRESS = gql`
    query GetReservationsByAddress($owner: Bytes!) {
        reservations(where: { owner: $owner }) {
            id
            owner
            dropId
            reservationTimestamp
            status
            restaurant {
                name
            }
        }
    }
`

const GET_MARKETPLACE_RESERVATIONS = gql`
    query GetMarketplaceReservations {
        listings {
            id
            seller
            price
            reservation {
                reservationTimestamp
                id
                restaurant {
                    name
                }
            }
        }
    }
`

export default {
    GET_MY_RESTAURANTS,
    GET_ACTIVE_RESTAURANTS,
    GET_RESTAURANT_BY_ID,
    GET_DROPS_BY_RESTAURANT_ID,
    GET_RESERVATION_TIMESTAMP_BY_DROP_ID,
    GET_RESERVATIONS_BY_ADDRESS,
    GET_MARKETPLACE_RESERVATIONS,
}
