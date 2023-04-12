import moment from "moment-timezone"

export const formatDurationLabel = (seconds) => {
    const duration = moment.duration(seconds, "seconds")
    const hours = duration.hours()
    const minutes = duration.minutes()

    if (hours === 0) {
        return `${minutes} min`
    }
    return `${hours} hr`
}

export const formatTimeLabel = (hours, minutes) => {
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    return `${formattedHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`
}

export const generateTimeOptions = (incrementInSeconds) => {
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

export const generateReservationSlots = (
    startDate,
    endDate,
    dailyStartTime,
    dailyEndTime,
    windowDuration
) => {
    const slots = []
    const startMoment = moment.unix(startDate).utc().startOf("day")
    const endMoment = moment.unix(endDate).utc().startOf("day")
    const dailyStart = moment.duration(dailyStartTime, "seconds")
    const dailyEnd = moment.duration(dailyEndTime, "seconds")
    const windowDurationMoment = moment.duration(windowDuration, "seconds")

    for (
        let currentDate = startMoment;
        currentDate.isSameOrBefore(endMoment);
        currentDate.add(1, "day")
    ) {
        let currentTime = currentDate.clone().add(dailyStart)
        const dailyEndMoment = currentDate.clone().add(dailyEnd)

        while (currentTime.isBefore(dailyEndMoment)) {
            slots.push(currentTime.toISOString())
            currentTime.add(windowDurationMoment)
        }
    }

    return slots
}
