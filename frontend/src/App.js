import React from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "./styles/globals.css"
import Header from "./components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Home from "./pages/index"
import Restaurant from "./pages/restaurants"
import RestaurantsComponent from "./pages/restaurants" // Import the Restaurants component
import RestaurantPage from "./pages/RestaurantPage" // Update the import statement

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/44793/reservnft/0.0.28",
})

function App() {
    return (
        <Router>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route
                                path="/restaurants/:restaurantId"
                                element={<RestaurantPage />}
                            />
                            <Route path="/restaurants" element={<RestaurantsComponent />} />{" "}
                            {/* Add this route */}
                        </Routes>
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </Router>
    )
}

export default App
