import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "../styles/globals.css"
import Head from "next/head"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>ReservNFT</title>
                <meta name="description" content="ReservNFT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
