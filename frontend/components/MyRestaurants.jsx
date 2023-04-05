import React from "react"
import { useMoralisQuery, useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import { Table, Tag, SvgMoreVert } from "web3uikit"
import GET_MY_RESTAURANTS from "../constants/subgraphQueries"

export default function MyRestaurants() {
    const { Moralis, chainId, isWeb3Enabled, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : null
    const {
        loading,
        error,
        data: myRestaurants,
    } = useQuery(GET_MY_RESTAURANTS, {
        variables: { ownerAddress: account },
        skip: !isWeb3Enabled || !account,
    })

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!myRestaurants?.restaurants?.length) return null

    const columns = [
        { Header: "Name", accessor: "name" },
        { Header: "Address", accessor: "businessAddress" },
        { Header: "Status", accessor: "isActive" },
    ]

    const data = myRestaurants.restaurants.map((restaurant) => {
        console.log("restaurant:", restaurant)
        return {
            ...restaurant,
            isActive: restaurant.isActive ? "Active" : "Inactive",
        }
    })

    return (
        <div className="p-5 border-2 border-gray-200 shadow-md rounded-lg">
            <h1 className="pb-4 font-bold text-3xl">My Restaurants</h1>
            <Table
                columnsConfig="80px 4fr 2fr 1fr 80px"
                data={data.map((restaurant) => [
                    <div key={restaurant.businessAddress}>{restaurant.name}</div>,
                    <div>{restaurant.businessAddress}</div>,
                    <div>{restaurant.isActive ? "Active" : "Inactive"}</div>,
                ])}
                header={[<span>Name</span>, <span>Address</span>, <span>Status</span>]}
                isColumnSortable={[true, false, false]}
                maxPages={3}
                onPageNumberChanged={function noRefCheck() {}}
                onRowClick={function noRefCheck() {}}
                pageSize={5}
            />
        </div>
    )
}
