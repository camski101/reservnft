import { gql } from "@apollo/client"

const GET_MY_RESTAURANTS = gql`
    query MyRestaurants($ownerAddress: Bytes!) {
        restaurants(first: 5, where: { owner: $ownerAddress }) {
            name
            businessAddress
            isActive
        }
    }
`

export default GET_MY_RESTAURANTS
