import styles from "@/styles/Home.module.css"
import { Table, Loading, Button } from "web3uikit"
import { useMoralis } from "react-moralis"
import React, { useEffect } from "react"
import { ChainCheck } from "@/components/ChainCheck"
import { useUpdateData } from "../contexts/UpdateDataContext"
import { useQuery } from "@apollo/client"
import subgraphQueries from "../constants/subgraphQueries"
import { truncate } from "truncate-ethereum-address"
import moment from "moment-timezone"

const { GET_MARKETPLACE_RESERVATIONS } = subgraphQueries

export default function Marketplace() {
    const { isWeb3Enabled, Moralis, account } = useMoralis()
    const { updateKey, refreshData } = useUpdateData()

    useEffect(() => {
        refetch()
    }, [updateKey])
    // Queries

    const {
        loading,
        error,
        refetch,
        data: marketplaceReservations,
    } = useQuery(GET_MARKETPLACE_RESERVATIONS, {
        skip: !isWeb3Enabled,
    })
    if (error) return <div>Error: {error.message}</div>
    if (!marketplaceReservations?.listings?.length) return null

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
    return (
        <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
            <ChainCheck />

            <div className="p-5 border-1">
                <h1 className="pb-4 font-bold text-3xl">Reservation Marketplace</h1>
                <Table
                    columnsConfig="3fr 2fr 4fr 2fr 2fr 3fr 3fr"
                    data={marketplaceReservations.listings.map((listing) => [
                        parseInt(listing.id, 16),
                        parseInt(listing.reservation.id, 16),
                        listing.reservation.restaurant.name,
                        moment
                            .utc(parseInt(listing.reservation.reservationTimestamp, 10) * 1000)
                            .format("YYYY-MM-DD HH:mm:ss"),
                        Moralis.Units.FromWei(listing.price),
                        truncate(listing.seller),
                        listing.seller == account ? (
                            <Button theme="primary" text={"Update"} />
                        ) : (
                            <Button theme="primary" text={"Buy"} />
                        ),
                    ])}
                    header={[
                        <span>Listing ID</span>,
                        <span>Token ID</span>,
                        <span>Restaurant</span>,
                        <span>Reservation Timestamp</span>,
                        <span>Price</span>,
                        <span>Seller</span>,
                        <span>Actions</span>,
                    ]}
                    isColumnSortable={[true, false, false]}
                    maxPages={10}
                    onPageNumberChanged={function noRefCheck() {}}
                    onRowClick={function noRefCheck() {}}
                    pageSize={5}
                />
            </div>
        </div>
    )
}
