import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useQuery } from "@apollo/client"
import { useNotification, Loading } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"
import { RestaurantManager, networkMapping } from "../constants"
import { RestaurantsTable } from "@/components/RestaurantsTable"

export default function MyRestaurants({ onDataChange, updateKey }) {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()
    const { GET_MY_RESTAURANTS } = subgraphQueries

    const [restaurantId, setRestaurantId] = useState(null)
    const [isActive, setIsActive] = useState(null)
    const [shouldToggle, setShouldToggle] = useState(false)

    const { runContractFunction: toggleIsActive } = useWeb3Contract({
        abi: RestaurantManager,
        contractAddress: rmAddress,
        functionName: "toggleIsActive",
        params: { restaurantId: restaurantId, isActive: isActive },
    })
    const {
        loading,
        error,
        data: myRestaurants,
        refetch,
    } = useQuery(GET_MY_RESTAURANTS, {
        variables: { ownerAddress: account ? account : null },
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

    const handleToggleActiveClick = async (id, isActive) => {
        setRestaurantId(id)
        setIsActive(isActive)
        setShouldToggle(true)
    }

    useEffect(() => {
        if (shouldToggle && restaurantId !== null && isActive !== null) {
            toggleIsActive({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
            setShouldToggle(false)
        }
    }, [shouldToggle, restaurantId, isActive, handleSuccess])

    useEffect(() => {
        refetch()
    }, [updateKey])

    if (loading) {
        return (
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "20px",
                }}
            >
                <Loading />
            </div>
        )
    }
    if (error) return <div>Error: {error.message}</div>
    if (!myRestaurants?.restaurants?.length) return null

    const data = myRestaurants.restaurants.map((restaurant) => {
        return {
            ...restaurant,
        }
    })

    return (
        <div className="p-5 border-1">
            <h1 className="pb-4 font-bold text-3xl">My Restaurants</h1>
            <RestaurantsTable
                data={data}
                columnsConfig="8fr 8fr 2fr 2fr 0fr"
                header={[
                    <span>Name</span>,
                    <span>Address</span>,
                    <span>Status</span>,
                    <span>Change Status</span>,
                ]}
                showStatus={true}
                onToggleStatus={(restaurant) =>
                    handleToggleActiveClick(
                        parseInt(restaurant.id.toString()),
                        !restaurant.isActive
                    )
                }
            />
        </div>
    )
}
