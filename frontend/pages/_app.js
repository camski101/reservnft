import { MoralisProvider } from "react-moralis"
import { NotificationProvider, Update } from "web3uikit"
import "../styles/globals.css"
import Head from "next/head"
import Header from "@/components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { UpdateDataProvider } from "../contexts/UpdateDataContext"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.GRAPH_URI, // doesn't work in env for some reason
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>ReservNFT</title>
                <meta name="description" content="ReservNFT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <UpdateDataProvider>
                            <Component {...pageProps} />
                        </UpdateDataProvider>
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
