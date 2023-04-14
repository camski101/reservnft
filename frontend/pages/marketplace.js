import styles from "@/styles/Home.module.css"
import { useMoralis } from "react-moralis"
import React, { useState, Suspense, lazy } from "react"
import { v4 as uuidv4 } from "uuid"
import { ChainCheck } from "@/components/ChainCheck"

export default function Marketplace() {
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
