import styles from "@/styles/Home.module.css"
import { useMoralis } from "react-moralis"
import RegisterRestaurant from "@/components/RegisterRestaurant"
import MyRestaurants from "@/components/MyRestaurants"
import ActiveRestaurants from "@/components/ActiveRestaurants"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { ChainCheck } from "@/components/ChainCheck"

const RegisterRestaurant = lazy(() => import("@/components/RegisterRestaurant"))
const ActiveRestaurants = lazy(() => import("@/components/ActiveRestaurants"))

export default function RestaurantsComponent() {
    const [updateKey, setUpdateKey] = useState(uuidv4())

    function handleDataChange() {
        setUpdateKey(uuidv4())
    }

    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            <ChainCheck />
            <div className="flex flex-row justify-center">
                <div className="w-2/3">
                    <ActiveRestaurants updateKey={updateKey} />
                    <Suspense fallback={<div>Loading...</div>}>
                        <ActiveRestaurants updateKey={updateKey} />
                    </Suspense>
                </div>
                <div className="w-1/3 h-full">
                    <RegisterRestaurant
                        onDataChange={handleDataChange}
                        className="p-8 bg-gray-100 rounded-lg shadow-lg h-full"
                    />
                </div>
            </div>
        </div>
    )
}
