import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useQuery } from "@apollo/client"
import { Table, Button, useNotification } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"
import { RestaurantManager, networkMapping } from "../constants"

export default function MyRestaurants({ onDataChange, updateKey }) {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()
    const { GET_MY_RESTAURANTS } = subgraphQueries

    const [restaurantId, setRestaurantId] = useState(null)
    const [shouldDeactivate, setShouldDeactivate] = useState(false)

    const { runContractFunction: deactivateRestaurant } = useWeb3Contract({
        abi: RestaurantManager,
        contractAddress: rmAddress,
        functionName: "deactivateRestaurant",
        params: { restaurantId: restaurantId },
    })
    const {
        loading,
        error,
        data: myRestaurants,
        refetch,
    } = useQuery(GET_MY_RESTAURANTS, {
        variables: { ownerAddress: account },
        skip: !isWeb3Enabled || !account,
    })

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
            onDataChange()
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleDeactivateRestaurantClick = async (e, id) => {
        e.preventDefault()
        setRestaurantId(id)
        setShouldDeactivate(true)
    }

    useEffect(() => {
        if (shouldDeactivate && restaurantId !== null) {
            deactivateRestaurant({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
            setShouldDeactivate(false)
        }
    }, [shouldDeactivate, restaurantId, handleSuccess])

    useEffect(() => {
        refetch()
    }, [updateKey])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!myRestaurants?.restaurants?.length) return null

    const data = myRestaurants.restaurants.map((restaurant) => {
        return {
            ...restaurant,
        }
    })

    return (
        <div className="p-5 border-2 border-gray-200 shadow-md rounded-lg">
            <h1 className="pb-4 font-bold text-3xl">My Restaurants</h1>
            <Table
                columnsConfig="8fr 8fr 2fr 2fr 0fr"
                data={data.map((restaurant) => [
                    <div key={restaurant.id}>{restaurant.name}</div>,
                    <div>{restaurant.businessAddress}</div>,
                    <div>{restaurant.isActive ? "Active" : "Inactive"}</div>,
                    <div>{parseInt(restaurant.id.toString())}</div>,
                    <Button
                        theme="primary"
                        type="button"
                        text="Deactivate"
                        onClick={(e) =>
                            handleDeactivateRestaurantClick(e, parseInt(restaurant.id.toString()))
                        }
                    />,
                ])}
                header={[
                    <span>Name</span>,
                    <span>Address</span>,
                    <span>Status</span>,
                    <span>Deactivate</span>,
                ]}
                isColumnSortable={[true, false, false]}
                maxPages={10}
                onPageNumberChanged={function noRefCheck() {}}
                onRowClick={function noRefCheck() {}}
                pageSize={5}
            />
        </div>
    )
}
