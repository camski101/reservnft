import React from "react"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { Card, Typography, Loading, Button } from "web3uikit"
import subgraphQueries from "@/constants/subgraphQueries"
import { useMoralis } from "react-moralis"

const { GET_RESTAURANT_BY_ID } = subgraphQueries

const Restaurant = () => {
    const { account } = useMoralis()
    const router = useRouter()
    const { restaurantId } = router.query

    const { loading, error, data } = useQuery(GET_RESTAURANT_BY_ID, {
        variables: { id: restaurantId ? "0x" + restaurantId.toString(16) : null },
        skip: !restaurantId || !account,
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
    if (!data) return null

    const restaurant = data.restaurant

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
                            <div
                                style={{
                                    width: "250px",
                                }}
                            >
                                <div className="mb-2">
                                    <Button theme="primary" text="Create a Drop" />
                                </div>
                                <div>
                                    <Card>Pretend NFT Card - not a real drop yet</Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Restaurant
