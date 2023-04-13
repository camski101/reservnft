import { useMoralis } from "react-moralis"
import { ChainCheck } from "../components/ChainCheck"
import styles from "../styles/Home.module.css"
import MyRestaurants from "../components/MyRestaurants"
import MyReservations from "../components/MyReservations"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            <ChainCheck />
            <MyRestaurants />
            <MyReservations />
        </div>
    )
}
