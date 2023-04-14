import { RestaurantManager, networkMapping } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState } from "react"
import { useNotification, Button, Loading } from "web3uikit"

export default function RegisterRestaurant({ onDataChange }) {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()

    // State for form input values
    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantBusinessAddress, setRestaurantBusinessAddress] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false)

    const {
        runContractFunction: registerRestaurant,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: RestaurantManager,
        contractAddress: rmAddress,
        functionName: "registerRestaurant",
        params: {
            name: restaurantName,
            businessAddress: restaurantBusinessAddress,
        },
    })

    // Function to handle form submission
    const handleSubmit = async (e) => {
        setButtonLoading(true)
        e.preventDefault()
        await registerRestaurant({
            onSuccess: (tx) => {
                handleSuccess(tx)
            },
            onError: (error) => {
                handleError(error)
                console.log(error)
            },
        })
    }

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
            handleNewNotification(
                "success",
                "Transaction Complete!",
                "Transaction Notification",
                tx
            )
            setRestaurantName("")
            setRestaurantBusinessAddress("")
            setButtonLoading(false)

            onDataChange()
        } catch (error) {
            console.log(error)
        }
    }

    const handleError = (error) => {
        handleNewNotification("error", error.message, "Transaction Notification")
        setButtonLoading(false)
    }

    if (!rmAddress) {
        return
    } else {
        return (
            <div className="p-5 border-1">
                <h1 className="pb-4 font-bold text-3xl">Register Restaurant</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Restaurant Name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={buttonLoading}
                    />
                    <input
                        type="text"
                        placeholder="Restaurant Business Address"
                        value={restaurantBusinessAddress}
                        onChange={(e) => setRestaurantBusinessAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={buttonLoading}
                    />
                    <Button
                        theme="primary"
                        text={
                            buttonLoading ? (
                                <Loading size={20} spinnerColor="#ffffff" spinnerType="wave" />
                            ) : (
                                "Register Restaurant"
                            )
                        }
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                        type="submit"
                        disabled={!restaurantName || !restaurantBusinessAddress}
                    />
                </form>
            </div>
        )
    }
}
