import React, { useEffect, useState, useCallback } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useQuery } from "@apollo/client"
import { useNotification, Loading } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"
import { RestaurantManager, networkMapping } from "../constants"
import { RestaurantsTable } from "@/components/RestaurantsTable"

export default function MyRestaurants({ updateKey }) {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()
    const { GET_MY_RESTAURANTS } = subgraphQueries

    const [restaurantId, setRestaurantId] = useState(null)
    const [isActive, setIsActive] = useState(null)
    const [shouldToggle, setShouldToggle] = useState(false)

    const [buttonLoading, setButtonLoading] = useState({})
    const [buttonId, setButtonId] = useState(null)

    const { runContractFunction: setRestaurantIsActive } = useWeb3Contract({
        abi: RestaurantManager,
        contractAddress: rmAddress,
        functionName: "setRestaurantIsActive",
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

    const handleSuccess = useCallback(
        async (tx) => {
            try {
                await tx.wait(1)
                handleNewNotification(
                    "success",
                    "Transaction Complete!",
                    "Transaction Notification",
                    tx
                )
                refetch()
                setShouldToggle(false)
                setButtonLoading((prevState) => ({ ...prevState, [buttonId]: false }))
            } catch (error) {
                console.log(error)
                setShouldToggle(false)
            }
        },
        [restaurantId, handleNewNotification, refetch]
    )

    const handleError = useCallback(
        (error) => {
            handleNewNotification("error", error.message, "Transaction Notification")
            setButtonLoading((prevState) => ({ ...prevState, [buttonId]: false }))
            setShouldToggle(false)
        },
        [restaurantId, handleNewNotification]
    )

    const handleToggleActiveClick = async (id, isActive, buttonId) => {
        setButtonLoading((prevButtonLoading) => ({ ...prevButtonLoading, [buttonId]: true }))
        setRestaurantId(id)
        setButtonId(buttonId)
        setIsActive(isActive)
        setShouldToggle(true)
    }

    useEffect(() => {
        if (shouldToggle && restaurantId !== null && isActive !== null) {
            setRestaurantIsActive({
                onSuccess: (tx) => handleSuccess(tx),
                onError: (error) => handleError(error),
            })
        }
    }, [shouldToggle, restaurantId, isActive])

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
                columnsConfig=" 3fr 2fr 2fr 0fr"
                header={[
                    <span>Name</span>,
                    <span>Address</span>,
                    <span>Status</span>,
                    <span>Change Status</span>,
                ]}
                showStatus={true}
                onToggleStatus={(restaurant) =>
                    handleToggleActiveClick(
                        parseInt(restaurant.id, 16),
                        !restaurant.isActive,
                        parseInt(restaurant.id, 16)
                    )
                }
                loadingState={buttonLoading}
                setButtonLoading={setButtonLoading}
            />
        </div>
    )
}
