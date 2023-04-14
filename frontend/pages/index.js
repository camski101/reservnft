import { useMoralis } from "react-moralis"
import { ChainCheck } from "@/components/ChainCheck"
import styles from "../styles/Home.module.css"
import MyRestaurants from "@/components/MyRestaurants"
import MyReservations from "@/components/MyReservations"
import { useUpdateData } from "../contexts/UpdateDataContext"

export default function Home() {
    const { updateKey } = useUpdateData()

    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            <ChainCheck />
            <MyRestaurants updateKey={updateKey} />
            <MyReservations updateKey={updateKey} />
        </div>
    )
}
