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
                        <div className="flex flex-row">
                            Nice friend! You are connected to a supported chainId: {chainId}
                        </div>
                    ) : (
                        <div className="text-red-600 font-bold">{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
        </div>
    )
}
