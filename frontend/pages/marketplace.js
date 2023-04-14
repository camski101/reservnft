import styles from "@/styles/Home.module.css"
import { useMoralis } from "react-moralis"
import React, { Suspense } from "react"
import { ChainCheck } from "@/components/ChainCheck"
import { useUpdateData } from "../contexts/UpdateDataContext"

export default function Marketplace() {
    const { updateKey, refreshData } = useUpdateData()

    // Queries

    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            <ChainCheck />
            <div className="flex flex-row justify-center">
                <div className="w-2/3">
                    <Suspense fallback={<div>Loading...</div>}>Hello</Suspense>
                </div>
            </div>
        </div>
    )
}
