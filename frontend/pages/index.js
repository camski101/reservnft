import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import { networkMapping } from "../constants"

const supportedChains = Object.keys(networkMapping)

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row items-center justify-center bg-green-200 text-green-800 p-4 rounded-lg shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="font-semibold">Nice friend!&nbsp;</span>You are
                            connected to a supported chainId: {chainId}
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
