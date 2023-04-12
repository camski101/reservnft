import { gql } from "@apollo/client"

const GET_MY_RESTAURANTS = gql`
    query MyRestaurants($ownerAddress: Bytes!) {
        restaurants(where: { owner: $ownerAddress }, orderBy: restaurantId, orderDirection: desc) {
            name
            businessAddress
            isActive
            id
            restaurantId
        }
    }
`

const GET_ACTIVE_RESTAURANTS = gql`
    query ActiveRestaurants {
        restaurants(where: { isActive: true }, orderBy: restaurantId, orderDirection: desc) {
            name
            businessAddress
            isActive
            id
            restaurantId
        }
    }
`

const GET_RESTAURANT_BY_ID = gql`
    query GET_RESTAURANT_BY_ID($id: ID!) {
        restaurant(id: $id) {
            id
            name
            businessAddress
            isActive
            owner
            restaurantId
        }
    }
`

const GET_DROPS_BY_RESTAURANT_ID = gql`
    query GET_DROPS_BY_RESTAURANT_ID($restaurantId: ID!) {
        drops(where: { restaurantId: $restaurantId }, orderBy: dropId, orderDirection: desc) {
            id
            dropId
            mintPrice
            startDate
            endDate
            dailyStartTime
            dailyEndTime
            windowDuration
            reservationsPerWindow
        }
    }
`

const GET_RESERVATION_TIMESTAMP_BY_DROP_ID = gql`
    query GetReservationTimestampCount($dropId: ID!) {
        reservations(where: { dropId: $dropId }) {
            reservationTimestamp
        }
    }
`

export default {
    GET_MY_RESTAURANTS,
    GET_ACTIVE_RESTAURANTS,
    GET_RESTAURANT_BY_ID,
    GET_DROPS_BY_RESTAURANT_ID,
    GET_RESERVATION_TIMESTAMP_BY_DROP_ID,
}
