import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">
                <a href="#/" className="text-current">
                    ReservNFT
                </a>
            </h1>
            <div className="flex flex-row items-center">
                <a href="#/" className="mr-4 p-6">
                    Home
                </a>
                <a href="#/restaurants" className="mr-4 p-6">
                    Restaurants
                </a>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
