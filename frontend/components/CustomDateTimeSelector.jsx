import React, { useState, useEffect } from "react"
import moment from "moment-timezone"

export const CustomDateTimeSelector = ({
    availableSlots,
    reservationsPerWindow,
    bookedReservations,
    windowDuration, // Duration in seconds (e.g., 900 for 15 minutes, 1800 for 30 minutes)
    onTimestampSelected,
    onInteraction,
    formDisabled,
}) => {
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedDay, setSelectedDay] = useState("")
    const [selectedHour, setSelectedHour] = useState("")
    const [selectedMinute, setSelectedMinute] = useState("")
    const [selectedTimestamp, setSelectedTimestamp] = useState(null)

    const [availableReservations, setAvailableReservations] = useState(0)

    const bookedReservationsMap = new Map()

    // Iterate over the bookedReservations array and update the counts in the Map
    bookedReservations.forEach((reservation) => {
        // Extract the reservationTimestamp value from the count object
        const reservationTimestamp = reservation.count.reservationTimestamp

        // Ensure that reservationTimestamp is defined and valid
        if (reservationTimestamp) {
            // Convert the UNIX timestamp to ISO string format using UTC time zone
            // Format the timestampISO to exclude seconds and milliseconds
            const timestampISO = moment
                .unix(parseInt(reservationTimestamp))
                .utc()
                .format("YYYY-MM-DDTHH:mm")
            // Check if the timestampISO is valid
            if (moment(timestampISO, "YYYY-MM-DDTHH:mm").isValid()) {
                // Get the current count for the timestamp from the Map (default to 0 if not found)
                const count = bookedReservationsMap.get(timestampISO) || 0
                // Update the count for the timestamp in the Map
                bookedReservationsMap.set(timestampISO, count + 1)
            }
        }
    })

    // Extract unique years, months, days, hours, and minutes from available slots
    const dateTimeStructure = availableSlots.reduce((acc, slot) => {
        const slotMoment = moment.utc(slot) // Use UTC timezone
        const year = slotMoment.year()
        const month = slotMoment.format("MMMM")
        const day = slotMoment.date()
        const hour = slotMoment.hour()
        const minute = slotMoment.minute()
        acc[year] = acc[year] || {}
        acc[year][month] = acc[year][month] || {}
        acc[year][month][day] = acc[year][month][day] || {}
        acc[year][month][day][hour] = acc[year][month][day][hour] || new Set()
        acc[year][month][day][hour].add(minute)
        return acc
    }, {})

    // Calculate available minutes based on windowDuration
    const availableMinutes = []
    for (let i = 0; i < 60; i += windowDuration / 60) {
        availableMinutes.push(i)
    }

    const shouldDisplayMinutesSelector = () => {
        return availableSlots.some((slot) => {
            const slotMoment = moment.utc(slot)
            return slotMoment.minute() !== 0
        })
    }

    // Update available reservations based on selected date-time
    useEffect(() => {
        if (selectedYear && selectedMonth && selectedDay && selectedHour) {
            const shouldDisplayMinutes = shouldDisplayMinutesSelector()

            if (!shouldDisplayMinutes || (shouldDisplayMinutes && selectedMinute)) {
                const selectedDateTime = moment.utc({
                    year: Number(selectedYear),
                    month: moment(`${selectedYear}-${selectedMonth}`, "YYYY-MMMM").month(),
                    date: Number(selectedDay),
                    hour: Number(selectedHour),
                    minute: Number(selectedMinute),
                })
                setSelectedTimestamp(selectedDateTime.unix())

                // Format the selectedDateTimeISO to exclude seconds and milliseconds using UTC time zone
                const selectedDateTimeISO = selectedDateTime.utc().format("YYYY-MM-DDTHH:mm")

                const matchingSlots = availableSlots.filter((slot) =>
                    slot.startsWith(selectedDateTimeISO)
                )
                // Retrieve the bookedCount using the formatted selectedDateTimeISO
                // Use the .get() method to access the value from the Map
                const bookedCount = bookedReservationsMap.get(selectedDateTimeISO) || 0
                setAvailableReservations(
                    matchingSlots.length * reservationsPerWindow - bookedCount
                )
            } else {
                setSelectedTimestamp(null)
                setAvailableReservations(0)
            }
        } else {
            setSelectedTimestamp(null)
            setAvailableReservations(0)
        }

        if (selectedTimestamp) {
            onTimestampSelected(selectedTimestamp)
            onInteraction()
        }
    }, [
        selectedYear,
        selectedMonth,
        selectedDay,
        selectedHour,
        selectedMinute,
        availableSlots,
        reservationsPerWindow,
        bookedReservationsMap,
        onTimestampSelected,
        onInteraction,
    ])

    const years = Object.keys(dateTimeStructure)
    const months = selectedYear ? Object.keys(dateTimeStructure[selectedYear] || {}) : []
    const days = selectedMonth
        ? Object.keys(dateTimeStructure[selectedYear]?.[selectedMonth] || {})
        : []
    const hours = selectedDay
        ? Object.keys(dateTimeStructure[selectedYear]?.[selectedMonth]?.[selectedDay] || {})
        : []

    const minutes = selectedHour
        ? Array.from(
              dateTimeStructure[selectedYear]?.[selectedMonth]?.[selectedDay]?.[selectedHour] || []
          )
        : []

    const hasNonZeroMinutes = availableSlots.some((slot) => {
        const slotMoment = moment.utc(slot)
        return slotMoment.minute() !== 0
    })

    return (
        <div className="space-y-2">
            <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={formDisabled} // Disable or enable based on formDisabled prop
            >
                <option value="">Select Year</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
            <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={formDisabled} // Disable or enable based on formDisabled prop
            >
                <option value="">Select Month</option>
                {months.map((month) => (
                    <option key={month} value={month}>
                        {month}
                    </option>
                ))}
            </select>
            <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                disabled={formDisabled} // Disable or enable based on formDisabled prop
            >
                <option value="">Select Day</option>
                {days.map((day) => (
                    <option key={day} value={day}>
                        {day}
                    </option>
                ))}
            </select>
            <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                disabled={formDisabled} // Disable or enable based on formDisabled prop
            >
                <option value="">Select Hour</option>
                {hours.map((hour) => (
                    <option key={hour} value={hour}>
                        {hour}:00
                    </option>
                ))}
            </select>
            {hasNonZeroMinutes && (
                <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    disabled={formDisabled} // Disable or enable based on formDisabled prop
                >
                    <option value="">Select Minute</option>
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            )}
            <div>Available Reservations: {availableReservations}</div>
        </div>
    )
}
