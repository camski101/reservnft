import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { Typography, Loading, Button } from "web3uikit"
import subgraphQueries from "@/constants/subgraphQueries"
import { useMoralis } from "react-moralis"
import { DropCard } from "@/components/DropCard"
import { DropModal } from "@/components/DropModal"

const { GET_RESTAURANT_BY_ID, GET_DROPS_BY_RESTAURANT_ID } = subgraphQueries

export default function Restaurant() {
    const { Moralis, account } = useMoralis()
    const router = useRouter()
    const { restaurantId } = router.query

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
        refetch,
    } = useQuery(GET_DROPS_BY_RESTAURANT_ID, {
        variables: { restaurantId: restaurantId ? "0x" + restaurantId.toString(16) : null },
        skip: !restaurantData || !restaurantId || !account,
    })

    const [modalVisible, setModalVisible] = useState(false)
    const openModal = () => {
        setModalVisible(true)
    }

    const handleOnClose = () => {
        setModalVisible(false)
    }

    const handleSubmit = (data) => {
        setModalVisible(false)
    }

    if (restaurantLoading || dropsLoading || !restaurantId) {
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

    if (!restaurantData || !restaurantData.restaurant) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="py-10">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6 sm:px-10 bg-white">
                                <Typography variant="h2" className="mb-2">
                                    No restaurant found.
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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
                                            text={"Create a Drop"}
                                            onClick={openModal}
                                        />
                                        <DropModal
                                            isVisible={modalVisible}
                                            onClose={handleOnClose}
                                            onSubmit={handleSubmit}
                                            restaurantId={parseInt(restaurant.id, 16)}
                                            refetchDrops={refetch}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {dropsData &&
                                    dropsData.drops.map((drop) => (
                                        <DropCard key={drop.id} drop={drop} />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
