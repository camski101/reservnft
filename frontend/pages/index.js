import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import { networkMapping } from "@/constants"
import { ChainCheck } from "@/components/ChainCheck"

const supportedChains = Object.keys(networkMapping)

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            <ChainCheck />
        </div>
    )
}
