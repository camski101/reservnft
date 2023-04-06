import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "../styles/globals.css"
import Head from "next/head"
import Header from "../components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.GRAPH_DEVELOPMENT_QUERY_URL, // needs to be updated in fleek every deploy for dev
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
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
