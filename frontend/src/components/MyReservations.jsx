import React, { useEffect, useContext } from "react"
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import { useNotification, Loading, Table } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"
import { networkMapping } from "../constants"
import moment from "moment-timezone"

export default function MyReservations() {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()
    const { GET_RESERVATIONS_BY_ADDRESS } = subgraphQueries

    const {
        loading,
        error,
        refetch,
        data: myReservations,
    } = useQuery(GET_RESERVATIONS_BY_ADDRESS, {
        variables: { owner: account ? account : null },
        skip: !isWeb3Enabled || !account,
    })

    if (loading) {
        return (
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "20px",
                }}
            >
                <Loading />
            </div>
        )
    }
    if (error) return <div>Error: {error.message}</div>
    if (!myReservations?.reservations?.length) return null
    if (!account) return null

    const dataSource = myReservations.reservations.map((reservation) => [
        "", // Empty column (you can replace this with desired content)

        parseInt(reservation.id, 16), // Token ID
        reservation.restaurant.name, // Restaurant Name
        moment
            .utc(parseInt(reservation.reservationTimestamp, 10) * 1000)
            .format("YYYY-MM-DD HH:mm:ss"), // Timestamp
        "", // Empty column (you can replace this with desired content)
    ])

    return (
        <div className="p-5 border-1">
            <h1 className="pb-4 font-bold text-3xl">My Reservations</h1>
            {/* Render the Table component */}
            <Table
                columnsConfig="80px 3fr 2fr 2fr 80px"
                data={dataSource}
                header={[
                    "",
                    <span>Token ID</span>,
                    <span>Restaurant Name</span>,
                    <span>Timestamp</span>,
                    "",
                ]}
                isColumnSortable={[false, true, false, false]}
                maxPages={3}
                onPageNumberChanged={() => {}}
                onRowClick={() => {}}
                pageSize={5}
            />
        </div>
    )
}
