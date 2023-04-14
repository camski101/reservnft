import React, { useState, useCallback, useEffect } from "react"
import { Modal, useNotification, Input, Loading } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ReservNFT, Marketplace, networkMapping } from "../constants"
import moment from "moment-timezone"

export default function ListModal({
    isVisible,
    reservation,
    onClose,
    setListModalVisible,
    refetch,
}) {
    const dispatch = useNotification()
    const { isWeb3Enabled, chainId: chainIdHex, account, Moralis } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const marketAddress = chainId in networkMapping ? networkMapping[chainId]["Marketplace"] : null
    const reservAddress = chainId in networkMapping ? networkMapping[chainId]["ReservNFT"] : null

    const tokenId = reservation ? parseInt(reservation.id, 16) : null
    const reservationTimestamp = reservation
        ? moment
              .utc(parseInt(reservation.reservationTimestamp, 10) * 1000)
              .format("YYYY-MM-DD HH:mm:ss")
        : null

    const reservationStatus = reservation ? reservation.status : null

    // State

    const [buttonLoading, setButtonLoading] = useState(false)
    const [listPrice, setListPrice] = useState(0)
    const [uiListPrice, setUIListPrice] = useState(0)

    // Contracts

    const {
        runContractFunction: approve,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: ReservNFT,
        contractAddress: reservAddress,
        functionName: "approve",
        params: {
            to: marketAddress,
            tokenId: tokenId,
        },
    })

    const {
        runContractFunction: listReservation,
        data: listTxResponse,
        isLoading: listLoading,
        isFetching: listFetching,
    } = useWeb3Contract({
        abi: Marketplace,
        contractAddress: marketAddress,
        functionName: "listReservation",
        params: {
            tokenId: tokenId,
            price: listPrice,
        },
    })

    // Change Handlers

    const handleListPriceChange = (listPrice) => {
        if (listPrice === "" || isNaN(listPrice)) {
            setUIListPrice("")
            setListPrice(0)
        } else {
            setUIListPrice(listPrice)
            setListPrice(Moralis.Units.ETH(listPrice))
        }
    }

    const listSubmit = async () => {
        setButtonLoading(true)

        approve({
            onSuccess: (tx) => {
                handleApprovalSuccess(tx)
            },
            onError: (error) => {
                handleError(error)
            },
        })
    }

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
        },
        [handleNewNotification]
    )

    const handleApprovalSuccess = useCallback(async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(
                "success",
                "Transaction Complete!",
                "Transaction Notification",
                tx
            )

            listReservation({
                onSuccess: (tx) => {
                    handleListSuccess(tx)
                },
                onError: (error) => {
                    handleError(error)
                },
            })
        } catch (error) {
            handleError(error)
            setButtonLoading(false)
        }
    })

    const handleListSuccess = useCallback(async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(
                "success",
                "Transaction Complete!",
                "Transaction Notification",
                tx
            )

            setButtonLoading(false)
            refetch()
            setListModalVisible(false)
        } catch (error) {
            handleError(error)
            setButtonLoading(false)
        }
    })

    return (
        <Modal
            title="List Reservation"
            isVisible={isVisible}
            onOk={listSubmit}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            okText={
                buttonLoading ? (
                    <Loading size={20} spinnerColor="#ffffff" spinnerType="wave" />
                ) : (
                    "List"
                )
            }
        >
            <div
                className="max-h-screen overflow-auto p-6"
                style={{
                    marginBottom: "20px",
                }}
            >
                <div className="text-xl font-bold mb-4">List A Reservation</div>

                <form>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Token ID</label>
                            <Input
                                className="mt-1 w-full border rounded-md p-2"
                                value={tokenId}
                                disabled={true}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Reservation Timestamp
                            </label>
                            <Input
                                className="mt-1 w-full border rounded-md p-2"
                                value={reservationTimestamp}
                                disabled={true}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">
                                List Price (MATIC)
                            </label>
                            <Input
                                className="mt-1 w-full border rounded-md p-2"
                                onChange={(e) => handleListPriceChange(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
