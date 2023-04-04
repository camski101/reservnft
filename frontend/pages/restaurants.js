import styles from "@/styles/Home.module.css"
import { useMoralis } from "react-moralis"
import RegisterRestaurant from "@/components/RegisterRestaurant"

import { networkMapping } from "@/constants"

const supportedChains = Object.keys(networkMapping)

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        // Show my restaurants - use graph protocol
        // Show all restaurants - use graph protocol
        // Register Restaurant
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row justify-center">
                            <RegisterRestaurant className="p-8 bg-gray-100 rounded-lg shadow-lg" />
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
