import React, { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import { Loading, Table, Button } from "web3uikit"
import subgraphQueries from "../constants/subgraphQueries"
import moment from "moment-timezone"
import ListModal from "../components/ListModal"

export default function MyReservations({ updateKey, onDataChange }) {
    useEffect(() => {
        refetch()
    }, [updateKey])

    const { isWeb3Enabled, account } = useMoralis()
    const { GET_RESERVATIONS_BY_ADDRESS } = subgraphQueries

    // State

    const [listModalVisible, setListModalVisible] = useState(false)
    const [listModalReservation, setListModalReservation] = useState(null)

    // Modal stuff

    const openListModel = (reservation) => {
        console.log(reservation)
        setListModalVisible(true)
        setListModalReservation(reservation)
    }

    const closeListModel = () => {
        setListModalVisible(false)
        setListModalReservation(null)
    }

    // Queries

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
        parseInt(reservation.id, 16), // Token ID
        reservation.restaurant.name, // Restaurant Name
        moment
            .utc(parseInt(reservation.reservationTimestamp, 10) * 1000)
            .format("YYYY-MM-DD HH:mm:ss"), // Timestamp
        reservation.status == "owned" ? (
            <Button theme="primary" text={"List"} onClick={() => openListModel(reservation)} />
        ) : (
            <Button theme="secondary" text={"Listed"} disabled={true} />
        ),
    ])

    // Render

    return (
        <div className="p-5 border-1">
            <h1 className="pb-4 font-bold text-3xl">My Reservations</h1>
            {/* Render the Table component */}
            <Table
                columnsConfig=" 3fr 2fr 2fr 0fr"
                data={dataSource}
                header={[
                    <span>Token ID</span>,
                    <span>Restaurant Name</span>,
                    <span>Timestamp</span>,
                    <span>Actions</span>,
                ]}
                isColumnSortable={[false, true, false, false]}
                maxPages={3}
                onPageNumberChanged={() => {}}
                onRowClick={() => {}}
                pageSize={5}
            />
            <ListModal
                isVisible={listModalVisible}
                setListModalVisible={setListModalVisible}
                reservation={listModalReservation}
                onClose={closeListModel}
                refetch={refetch}
                onDataChange={onDataChange}
            />
        </div>
    )
}
