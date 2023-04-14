import { createContext, useContext, useState } from "react"

const UpdateDataContext = createContext()

export const useUpdateData = () => {
    return useContext(UpdateDataContext)
}

export const UpdateDataProvider = ({ children }) => {
    const [updateKey, setUpdateKey] = useState(null)

    const refreshData = () => {
        setUpdateKey(Date.now())
    }

    return (
        <UpdateDataContext.Provider value={{ updateKey, refreshData }}>
            {children}
        </UpdateDataContext.Provider>
    )
}
