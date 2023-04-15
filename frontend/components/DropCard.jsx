import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { Card, Typography, Modal, useNotification, Loading } from "web3uikit"
import { generateReservationSlots } from "@/utils/dateUtils"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ReservNFT, networkMapping } from "../constants"
import { CustomDateTimeSelector } from "@/components/CustomDateTimeSelector"
import subgraphQueries from "@/constants/subgraphQueries"

const { GET_RESERVATION_TIMESTAMP_BY_DROP_ID } = subgraphQueries

export const DropCard = ({ drop }) => {
    const dispatch = useNotification()

    // Vars

    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const reservAddress = chainId in networkMapping ? networkMapping[chainId]["ReservNFT"] : null

    // State

    const [buttonLoading, setButtonLoading] = useState(false)
    const [formDisabled, setFormDisabled] = useState(false)
    const [reservationTimestamp, setReservationTimestamp] = useState(0)
    const [mintModalVisible, setMintModalVisible] = useState(false)

    // Queries

    const {
        loading: reservationLoading,
        error: reservationError,
        data: mintedReservationsData,
        refetch,
    } = useQuery(GET_RESERVATION_TIMESTAMP_BY_DROP_ID, {
        variables: {
            dropId: drop.id,
        },
    })

    // Contract calls

    const { runContractFunction: createReservNFT, data: enterTxResponse } = useWeb3Contract({
        abi: ReservNFT,
        contractAddress: reservAddress,
        functionName: "createReservNFT",
        params: {
            dropId: parseInt(drop.id, 16),
            reservationTimestamp: reservationTimestamp,
        },
        msgValue: drop.mintPrice,
    })

    // Handlers

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormDisabled(true)
        setButtonLoading(true)
        await createReservNFT({
            onSuccess: (tx) => {
                handleSuccess(tx)
            },
            onError: (error) => {
                handleError(error)
                console.log(error)
            },
        })
    }

    // Handlers

    const handleMintOnClose = () => {
        setMintModalVisible(false)
    }

    const handleNewNotification = (type, message, title, tx) => {
        dispatch({
            type: type,
            message: message,
            title: title,
            position: "topR",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification("success", "Mint Complete!", "Transaction Notification", tx)
            setButtonLoading(false)
            setMintModalVisible(false)
            setFormDisabled(false)
            refetch()
        } catch (error) {
            console.log(error)
        }
    }

    const handleError = (error) => {
        handleNewNotification("error", error.message, "Transaction Notification")
        setButtonLoading(false)
        setFormDisabled(false)
    }

    // Modal stuff

    const openMintModal = () => {
        refetch()
        setMintModalVisible(true)
    }

    const slots = generateReservationSlots(
        drop.startDate,
        drop.endDate,
        drop.dailyStartTime,
        drop.dailyEndTime,
        drop.windowDuration,
        drop.reservationsPerWindow
    )

    if (reservationLoading) {
        return <div>Loading reservations...</div>
    }

    // If there is an error, render an error message
    if (reservationError) {
        return <div>Error loading reservations: {reservationError.message}</div>
    }

    // Extract the reservations array from the data object
    const mintedReservations = mintedReservationsData?.reservations || []

    // Use a Map to keep track of the counts for each timestamp
    const bookedReservationsMap = new Map()

    // Iterate over the mintedReservations array and update the counts in the Map
    mintedReservations.forEach((reservation) => {
        const timestamp = reservation.reservationTimestamp
        const count = bookedReservationsMap.get(timestamp) || 0
        bookedReservationsMap.set(timestamp, count + 1)
    })

    // Render

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
            <Card onClick={openMintModal}>
                <div>
                    <Typography className="mb-2 block">Drop ID: {parseInt(drop.id)}</Typography>
                    <Typography className="mb-2 block">
                        Mint Price: {Moralis.Units.FromWei(drop.mintPrice)} MATIC
                    </Typography>
                </div>
            </Card>
            <div>
                <Modal
                    isVisible={mintModalVisible}
                    canOverflow
                    onCancel={handleMintOnClose}
                    id="regular"
                    okText={
                        buttonLoading ? (
                            <Loading size={20} spinnerColor="#ffffff" spinnerType="wave" />
                        ) : (
                            "Mint"
                        )
                    }
                    cancelText="Cancel"
                    onCloseButtonPressed={handleMintOnClose}
                    onOk={handleSubmit}
                >
                    {" "}
                    <CustomDateTimeSelector
                        availableSlots={slots}
                        reservationsPerWindow={drop.reservationsPerWindow}
                        bookedReservations={Object.entries(mintedReservations).map(
                            ([timestamp, count]) => ({
                                timestamp,
                                count,
                            })
                        )}
                        windowDuration={drop.windowDuration}
                        onTimestampSelected={setReservationTimestamp}
                        onInteraction={refetch}
                        formDisabled={formDisabled}
                    />
                </Modal>
            </div>
        </div>
    )
}
