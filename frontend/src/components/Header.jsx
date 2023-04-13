import { ConnectButton } from "web3uikit"
import { Link } from "react-router-dom"

export default function Header() {
    return (
        <nav className="p-5 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">
                <Link to="/" className="text-current">
                    ReservNFT
                </Link>
            </h1>
            <div className="flex flex-row items-center">
                <Link to="/" className="mr-4 p-6">
                    Home
                </Link>
                <Link to="/restaurants" className="mr-4 p-6">
                    Restaurants
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
