import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "../styles/globals.css"
import Head from "next/head"
import Header from "../components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/44793/reservnft/0.0.16", // doesn't work in env for some reason
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
