import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import { Table } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"

const { GET_ALL_RESTAURANTS } = subgraphQueries

export default function AllRestaurants({ onRestaurantRegistered }) {
    const { Moralis, chainId, isWeb3Enabled, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : null
    const {
        loading,
        error,
        data: allRestaurants,
        refetch,
    } = useQuery(GET_ALL_RESTAURANTS, {
        skip: !isWeb3Enabled || !account,
    })

    useEffect(() => {
        if (onRestaurantRegistered) {
            refetch()
        }
    }, [onRestaurantRegistered, refetch])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!allRestaurants?.restaurants?.length) return null

    const columns = [
        { Header: "Name", accessor: "name" },
        { Header: "Address", accessor: "businessAddress" },
        { Header: "Status", accessor: "isActive" },
    ]

    const data = allRestaurants.restaurants.map((restaurant) => {
        return {
            ...restaurant,
            isActive: restaurant.isActive ? "Active" : "Inactive",
        }
    })

    return (
        <div className="p-5 border-2 border-gray-200 shadow-md rounded-lg">
            <h1 className="pb-4 font-bold text-3xl">All Restaurants</h1>
            <Table
                columnsConfig="4fr 8fr 2fr"
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
