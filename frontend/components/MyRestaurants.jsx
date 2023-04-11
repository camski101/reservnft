import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useQuery } from "@apollo/client"
import { useNotification, Loading } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"
import { RestaurantManager, networkMapping } from "../constants"
import { RestaurantsTable } from "@/components/RestaurantsTable"

export default function MyRestaurants() {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()
    const { GET_MY_RESTAURANTS } = subgraphQueries

    const [restaurantId, setRestaurantId] = useState(null)
    const [isActive, setIsActive] = useState(null)
    const [shouldToggle, setShouldToggle] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)

    const { runContractFunction: toggleIsActive } = useWeb3Contract({
        abi: RestaurantManager,
        contractAddress: rmAddress,
        functionName: "toggleRestaurantIsActive",
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

    const handleNewNotification = (type, message, title, tx) => {
        dispatch({
            type: type,
            message: message,
            title: title,
            position: "topR",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification("info", "Transaction Complete!", "Transaction Notification", tx)
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    const handleToggleActiveClick = async (id, isActive) => {
        setButtonLoading(true)
        setRestaurantId(id)
        setIsActive(isActive)
        setShouldToggle(true)
    }

    useEffect(() => {
        if (shouldToggle && restaurantId !== null && isActive !== null) {
            console.log("Calling toggleIsActive", restaurantId, isActive)

            toggleIsActive({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
            setShouldToggle(false)
            setButtonLoading(false)
        }
    }, [shouldToggle, restaurantId, isActive, handleSuccess])

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
    if (!account) return null

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
                        !restaurant.isActive,
                        buttonLoading
                    )
                }
            />
        </div>
    )
}
