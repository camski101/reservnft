import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { Card, Typography, Loading, Button } from "web3uikit"
import subgraphQueries from "@/constants/subgraphQueries"
import { useMoralis } from "react-moralis"
import { DropModal } from "@/components/DropModal"

const { GET_RESTAURANT_BY_ID, GET_DROPS_BY_RESTAURANT_ID } = subgraphQueries

export default function Restaurant() {
    const { Moralis, account } = useMoralis()
    const router = useRouter()
    const { restaurantId } = router.query

    const [buttonLoading, setButtonLoading] = useState(false)

    const {
        loading: restaurantLoading,
        error: restaurantError,
        data: restaurantData,
    } = useQuery(GET_RESTAURANT_BY_ID, {
        variables: { id: restaurantId ? "0x" + restaurantId.toString(16) : null },
        skip: !restaurantId || !account,
    })

    const {
        loading: dropsLoading,
        error: dropsError,
        data: dropsData,
    } = useQuery(GET_DROPS_BY_RESTAURANT_ID, {
        variables: { restaurantId: restaurantId },
        skip: !restaurantData || !restaurantId || !account,
    })

    const [modalVisible, setModalVisible] = useState(false)

    const openModal = () => {
        setModalVisible(true)
        setButtonLoading(true)
    }

    const handleOnClose = () => {
        setModalVisible(false)
        setButtonLoading(false)
    }

    const handleSubmit = (data) => {
        // Process form values from data object as needed
        setModalVisible(false)
    }

    if (restaurantLoading || !restaurantId) {
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
    if (restaurantError) return <div>Error: {restaurantError.message}</div>

    if (!restaurantData) return null

    const restaurant = restaurantData.restaurant

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6 sm:px-10 bg-white">
                            <div className="mb-4">
                                <div>
                                    <Typography variant="h2" className="mb-2">
                                        {restaurant.name}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body18" className="mb-2">
                                        <strong>Location:</strong> {restaurant.businessAddress}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body18" className="mb-2">
                                        <strong>Status:</strong>{" "}
                                        {restaurant.isActive ? "Active" : "Inactive"}
                                    </Typography>
                                </div>
                                <Typography variant="body18">
                                    <strong>Owner:</strong>{" "}
                                    {restaurant.owner === account
                                        ? `You (${restaurant.owner})`
                                        : restaurant.owner}{" "}
                                </Typography>
                            </div>
                            <div className="flex flex-wrap -mx-2">
                                {restaurant.owner === account ? (
                                    <div className="w-full p-2">
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
                                                    "Create a Drop"
                                                )
                                            }
                                            onClick={openModal}
                                        />
                                        <DropModal
                                            isVisible={modalVisible}
                                            onClose={handleOnClose}
                                            onSubmit={handleSubmit}
                                            restaurantId={restaurant.restaurantId}
                                            setButtonLoading={setButtonLoading}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}

                                {dropsData &&
                                    dropsData.drops.map((drop) => (
                                        <div
                                            key={drop.id}
                                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
                                        >
                                            <Card>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        Drop ID: {drop.dropId}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        Mint Price:{" "}
                                                        {Moralis.Units.FromWei(drop.mintPrice)}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        Start Date:{" "}
                                                        {new Date(
                                                            parseInt(drop.startDate, 10) * 1000
                                                        ).toLocaleDateString()}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        End Date:{" "}
                                                        {new Date(
                                                            parseInt(drop.endDate, 10) * 1000
                                                        ).toLocaleDateString()}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        Daily Start Time: {drop.dailyStartTime}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        Daily End Time: {drop.dailyEndTime}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography classname="mb-2 block">
                                                        Window Duration: {drop.windowDuration}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography>
                                                        Reservations per Window:{" "}
                                                        {drop.reservationsPerWindow}
                                                    </Typography>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
