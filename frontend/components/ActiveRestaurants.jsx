import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import { Table } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"

const { GET_ACTIVE_RESTAURANTS } = subgraphQueries

export default function ActiveRestaurants({ updateKey }) {
    const { Moralis, chainId, isWeb3Enabled, account } = useMoralis()
    const {
        loading,
        error,
        data: activeRestaurants,
        refetch,
    } = useQuery(GET_ACTIVE_RESTAURANTS, {
        skip: !isWeb3Enabled || !account,
    })

    useEffect(() => {
        refetch()
    }, [updateKey])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!activeRestaurants?.restaurants?.length) return null

    const data = activeRestaurants.restaurants.map((restaurant) => {
        return {
            ...restaurant,
        }
    })

    return (
        <div className="p-5 border-2 border-gray-200 shadow-md rounded-lg">
            <h1 className="pb-4 font-bold text-3xl">Active Restaurants</h1>
            <Table
                columnsConfig="4fr 8fr 2fr"
                data={data.map((restaurant) => [
                    <div key={restaurant.id}>{restaurant.name}</div>,
                    <div>{restaurant.businessAddress}</div>,
                ])}
                header={[<span>Name</span>, <span>Address</span>]}
                isColumnSortable={[true, false, false]}
                maxPages={10}
                onPageNumberChanged={function noRefCheck() {}}
                onRowClick={function noRefCheck() {}}
                pageSize={5}
            />
        </div>
    )
}
