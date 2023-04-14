import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">
                <Link href="/" className="text-current">
                    ReservNFT
                </Link>
            </h1>
            <div className="flex flex-row items-center">
                <Link href="/" className="mr-4 p-6">
                    Home
                </Link>
                <Link href="/restaurants" className="mr-4 p-6">
                    Restaurants
                </Link>
                <Link href="/marketplace" className="mr-4 p-6">
                    Marketplace
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
