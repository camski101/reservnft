import styles from "@/styles/Home.module.css"
import { Table, Loading, Button, useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import React, { useEffect, useState, useCallback } from "react"
import { ChainCheck } from "@/components/ChainCheck"
import { useUpdateData } from "../contexts/UpdateDataContext"
import { useQuery } from "@apollo/client"
import subgraphQueries from "../constants/subgraphQueries"
import { truncate } from "truncate-ethereum-address"
import moment from "moment-timezone"
import { Marketplace, networkMapping } from "../constants"

const { GET_MARKETPLACE_RESERVATIONS } = subgraphQueries

export default function ReservMarket() {
    const dispatch = useNotification()
    const { updateKey, refreshData } = useUpdateData()
    const { isWeb3Enabled, chainId: chainIdHex, account, Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const marketAddress = chainId in networkMapping ? networkMapping[chainId]["Marketplace"] : null

    useEffect(() => {
        refetch()
    }, [updateKey])

    // State

    const [buttonLoading, setButtonLoading] = useState(false)
    const [tokenId, setTokenId] = useState(null)
    const [listPrice, setListPrice] = useState(null)
    const [action, setAction] = useState(null)

    // Contract functions

    // Contracts

    const { runContractFunction: buyReservation, data: buyTxResponse } = useWeb3Contract({
        abi: Marketplace,
        contractAddress: marketAddress,
        functionName: "buyReservation",
        params: {
            tokenId: tokenId,
        },
        msgValue: listPrice,
    })

    const { runContractFunction: cancelReservationListing, data: cancelTxResponse } =
        useWeb3Contract({
            abi: Marketplace,
            contractAddress: marketAddress,
            functionName: "cancelReservationListing",
            params: {
                tokenId: tokenId,
            },
        })

    // Queries

    const {
        loading,
        error,
        refetch,
        data: marketplaceReservations,
    } = useQuery(GET_MARKETPLACE_RESERVATIONS, {
        skip: !isWeb3Enabled,
    })

    // Handlers

    const handleNewNotification = (type, message, title, tx) => {
        dispatch({
            type: type,
            message: message,
            title: title,
            position: "topR",
        })
    }

    const handleError = useCallback(
        (error) => {
            handleNewNotification("error", error.message, "Transaction Notification")
            setButtonLoading(false)
            setTokenId(null)

            console.log(error)
        },
        [handleNewNotification]
    )

    const handleBuySuccess = useCallback(async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification("success", "Buy Complete!", "Transaction Notification", tx)
            setButtonLoading(false)
            refreshData()
            refetch()
            setTokenId(null)
        } catch (error) {
            handleError(error)
            setButtonLoading(false)
            setTokenId(null)
        }
    })

    const handleBuy = async (tokenId, listPrice) => {
        setButtonLoading(true)
        setTokenId(tokenId)
        setListPrice(listPrice)
        setAction("buy")
    }

    const handleCancel = async (tokenId) => {
        setButtonLoading(true)
        setTokenId(tokenId)
        setAction("cancel")
    }

    useEffect(() => {
        if (tokenId !== null && action !== null) {
            if (action === "buy") {
                buyReservation({
                    onSuccess: (tx) => {
                        handleBuySuccess(tx)
                    },
                    onError: (error) => {
                        handleError(error)
                    },
                })
            } else if (action === "cancel") {
                cancelReservationListing({
                    onSuccess: (tx) => {
                        handleCancelSuccess(tx)
                    },
                    onError: (error) => {
                        handleError(error)
                    },
                })
            }
        }
    }, [tokenId, action])

    const handleCancelSuccess = useCallback(async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification("success", "Listing Cancelled!", "Transaction Notification", tx)
            setButtonLoading(false)
            refreshData()
            refetch()
            setTokenId(null)
        } catch (error) {
            handleError(error)
            setButtonLoading(false)
            setTokenId(null)
        }
    })

    if (error) return <div>Error: {error.message}</div>
    if (!marketplaceReservations?.listings?.length)
        return (
            <div className={`p-6 bg-white shadow-md rounded-lg ${styles.container}`}>
                <ChainCheck />
                <div className="p-5 border-1">
                    <h1 className="pb-4 font-bold text-3xl">Reservation Marketplace</h1>
                    <p className="text-center">No reservations listed</p>
                </div>
            </div>
        )

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
                            <Button
                                theme="colored"
                                color="red"
                                text={
                                    buttonLoading ? (
                                        <Loading
                                            size={20}
                                            spinnerColor="#FF0000"
                                            spinnerType="wave"
                                        />
                                    ) : (
                                        "Cancel"
                                    )
                                }
                                onClick={() => handleCancel(parseInt(listing.reservation.id, 16))}
                            />
                        ) : (
                            <Button
                                theme="primary"
                                text={
                                    buttonLoading ? (
                                        <Loading
                                            size={20}
                                            spinnerColor="#ffffff"
                                            spinnerType="wave"
                                        />
                                    ) : (
                                        "Buy"
                                    )
                                }
                                onClick={() =>
                                    handleBuy(parseInt(listing.reservation.id, 16), listing.price)
                                }
                            />
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
