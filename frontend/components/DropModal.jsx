import React, { useState } from "react"
import { Modal, Input, DatePicker, Dropdown, useNotification } from "web3uikit"
import moment from "moment-timezone"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { RestaurantManager, networkMapping } from "../constants"

export const DropModal = ({ isVisible, onClose, onSubmit, restaurantId }) => {
    const tz = moment.tz.guess()
    const [transactionSuccess, setTransactionSuccess] = useState(true)
    const [mintPrice, setMintPrice] = useState(0)
    const [uiMintPrice, setUIMintPrice] = useState(0)
    const [startDate, setStartDate] = useState(moment.tz(new Date(), tz).unix()) // Set default start date
    const [endDate, setEndDate] = useState(moment.tz(new Date(), tz).unix()) // Set default end date
    const [dailyStartTime, setDailyStartTime] = useState(null)
    const [dailyEndTime, setDailyEndTime] = useState(null)
    const [windowDuration, setWindowDuration] = useState(null)
    const [reservationsPerWindow, setReservationsPerWindow] = useState("")

    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const rmAddress =
        chainId in networkMapping ? networkMapping[chainId]["RestaurantManager"] : null
    const dispatch = useNotification()

    const {
        runContractFunction: createDrop,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: RestaurantManager,
        contractAddress: rmAddress,
        functionName: "createDrop",
        params: {
            restaurantId: restaurantId,
            mintPrice: mintPrice,
            startDate: startDate,
            endDate: endDate,
            dailyStartTime: dailyStartTime,
            dailyEndTime: dailyEndTime,
            windowDuration: windowDuration,
            reservationsPerWindow: reservationsPerWindow,
        },
    })

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            handleNewNotification(tx)

            setMintPrice(0)
            setStartDate(new Date())
            setEndDate(new Date())
            setDailyStartTime(null)
            setDailyEndTime(null)
            setWindowDuration(null)
            setReservationsPerWindow("")

            setTransactionSuccess(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleSubmit = async (data) => {
        data = {
            mintPrice: mintPrice,
            startDate: moment.tz(startDate, tz).unix(),
            endDate: moment.tz(endDate, tz).unix(),
            dailyStartTime,
            dailyEndTime,
            windowDuration,
            reservationsPerWindow,
        }

        console.log(data)

        setTransactionSuccess(false)

        await createDrop({
            onSuccess: (tx) => {
                handleSuccess(tx)
            },
            onError: (error) => {
                console.log(error)
            },
        })

        onSubmit(data)
    }

    const formatTimeLabel = (hours, minutes) => {
        const period = hours >= 12 ? "PM" : "AM"
        const formattedHours = hours % 12 || 12
        return `${formattedHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")} ${period}`
    }

    const reservationOptions = [
        { id: "900", label: "15 min" }, // 15 * 60
        { id: "1800", label: "30 min" }, // 30 * 60
        { id: "3600", label: "1 hr" }, // 60 * 60
        { id: "7200", label: "2 hr" }, // 120 * 60
        { id: "14400", label: "4 hr" }, // 240 * 60
    ]

    const [startTimeOptions, setStartTimeOptions] = useState([])
    const [endTimeOptions, setEndTimeOptions] = useState([])

    const generateTimeOptions = (incrementInSeconds) => {
        const timeOptions = []
        const totalMinutes = 24 * 60
        const increment = incrementInSeconds / 60 // Convert to minutes
        for (let i = 0; i < totalMinutes; i += increment) {
            const hours = Math.floor(i / 60)
            const minutes = i % 60
            const timeLabel = formatTimeLabel(hours, minutes)
            timeOptions.push({ id: i * 60, label: timeLabel }) // Store in seconds
        }
        // Ensure the last option is "23:59"
        if (timeOptions[timeOptions.length - 1].id !== 23 * 60 * 60 + 59 * 60) {
            timeOptions.push({ id: 23 * 60 * 60 + 59 * 60, label: "11:59 PM" })
        }
        return timeOptions
    }

    const handleTimeChange = (selectedOption, isStartTime) => {
        const selectedTimeInSeconds = parseInt(selectedOption.id)
        if (isStartTime) {
            setDailyStartTime(selectedTimeInSeconds)
            const endTimeOptions = generateTimeOptions(windowDuration).filter(
                (option) => parseInt(option.id) > selectedTimeInSeconds
            )
            setEndTimeOptions(endTimeOptions)
        } else {
            setDailyEndTime(selectedTimeInSeconds)
            const startTimeOptions = generateTimeOptions(windowDuration).filter(
                (option) => parseInt(option.id) < selectedTimeInSeconds
            )
            setStartTimeOptions(startTimeOptions)
        }
    }

    const handleWindowDurationChange = (selectedOption) => {
        const increment = parseInt(selectedOption.id)
        setWindowDuration(increment)
        setStartTimeOptions(generateTimeOptions(increment).slice(0, -1))
        setEndTimeOptions(generateTimeOptions(increment).slice(1))
    }

    const handleMintPriceChange = (mintPrice) => {
        if (mintPrice === "" || isNaN(mintPrice)) {
            setMintPrice(0)
            setUIMintPrice("")
        } else {
            setMintPrice(Moralis.Units.ETH(mintPrice))
            setUIMintPrice(mintPrice)
        }
    }

    return (
        <Modal
            isVisible={isVisible}
            onCloseButtonPressed={onClose}
            onOk={handleSubmit}
            className="bg-white rounded-lg p-6"
        >
            <div
                className="max-h-screen overflow-auto p-6"
                style={{
                    marginBottom: "20px",
                }}
            >
                <div className="text-xl font-bold mb-4">Create a Drop</div>

                <form>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Mint Price (MATIC)
                            </label>
                            <Input
                                className="mt-1 w-full border rounded-md p-2"
                                value={uiMintPrice}
                                onChange={(e) => handleMintPriceChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Drop Start Date (UTC)
                            </label>
                            <DatePicker
                                className="mt-1 w-full"
                                selectedDate={startDate}
                                onChange={(date) => setStartDate(moment.tz(date.date, tz).unix())}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Drop End Date (UTC)
                            </label>
                            <DatePicker
                                className="mt-1 w-full"
                                selectedDate={endDate}
                                onChange={(date) => setEndDate(moment.tz(date.date, tz).unix())}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Reservation Window:
                            </label>
                            <Dropdown
                                className="mt-1 w-full"
                                onChange={handleWindowDurationChange}
                                options={reservationOptions}
                            />
                        </div>
                        {windowDuration && (
                            <div className="space-y-4 max-h-[150px] overflow-y-auto relative">
                                <div className="z-10">
                                    <label className="block text-gray-700 font-medium">
                                        Daily Start Time UTC:
                                    </label>
                                    <Dropdown
                                        className="mt-1 w-full"
                                        onChange={(selectedOption) =>
                                            handleTimeChange(selectedOption, true)
                                        }
                                        options={startTimeOptions}
                                    />
                                </div>
                                <div className="z-10">
                                    <label className="block text-gray-700 font-medium">
                                        Daily End Time UTC:
                                    </label>
                                    <Dropdown
                                        className="mt-1 w-full"
                                        onChange={(selectedOption) =>
                                            handleTimeChange(selectedOption, false)
                                        }
                                        options={endTimeOptions}
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 font-medium">
                                Number of Reservations per Window
                            </label>
                            <Input
                                className="mt-1 w-full border rounded-md p-2 mb-4"
                                type="number"
                                value={reservationsPerWindow}
                                onChange={(e) => setReservationsPerWindow(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
