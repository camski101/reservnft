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

export default { GET_MY_RESTAURANTS, GET_ACTIVE_RESTAURANTS, GET_RESTAURANT_BY_ID }
