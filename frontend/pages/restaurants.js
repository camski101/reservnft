import styles from "@/styles/Home.module.css"
import { useMoralis } from "react-moralis"
import RegisterRestaurant from "@/components/RegisterRestaurant"
import MyRestaurants from "@/components/MyRestaurants"
import AllRestaurants from "@/components/AllRestaurants"
import React, { useState } from "react"

import { networkMapping } from "@/constants"

const supportedChains = Object.keys(networkMapping)

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    const [refetch, setRefetch] = useState(false)

    const onRestaurantRegistered = () => {
        setRefetch((prevRefetch) => !prevRefetch)
    }

    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row justify-center">
                            <div className="w-2/3">
                                <MyRestaurants />
                                <AllRestaurants />
                            </div>
                            <div className="w-1/3 h-full">
                                <RegisterRestaurant
                                    className="p-8 bg-gray-100 rounded-lg shadow-lg h-full"
                                    onRestaurantRegistered={onRestaurantRegistered}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-red-600 font-bold">{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div className="text-red-600 font-bold">Please connect to a Wallet</div>
            )}
        </div>
    )
}
