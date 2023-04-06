import { RestaurantManager, networkMapping } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState } from "react"
import { useNotification } from "web3uikit"

export default function RegisterRestaurant({ onDataChange }) {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()

    // State for form input values
    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantBusinessAddress, setRestaurantBusinessAddress] = useState("")
    const [transactionSuccess, setTransactionSuccess] = useState(true)

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
        setTransactionSuccess(false)
        e.preventDefault()
        await registerRestaurant({
            onSuccess: (tx) => {
                handleSuccess(tx)
            },
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)

            setRestaurantName("")
            setRestaurantBusinessAddress("")
            setTransactionSuccess(true)
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

    return (
        <div className="p-5 border-2 border-gray-200 shadow-md rounded-lg">
            <h1 className="pb-4 font-bold text-3xl">Register Restaurant</h1>
            {rmAddress ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Restaurant Name"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={!transactionSuccess}
                    />
                    <input
                        type="text"
                        placeholder="Restaurant Business Address"
                        value={restaurantBusinessAddress}
                        onChange={(e) => setRestaurantBusinessAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={!transactionSuccess}
                    />
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                        type="submit"
                        disabled={!transactionSuccess}
                    >
                        {isLoading || !transactionSuccess ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Register Restaurant"
                        )}
                    </button>
                </form>
            ) : (
                <div className="text-red-600 font-bold">Please connect to a supported chain</div>
            )}
        </div>
    )
}
