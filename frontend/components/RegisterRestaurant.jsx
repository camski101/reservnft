import { contractAddresses, abi } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";

export default function RegisterRestaurant() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const rmAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const dispatch = useNotification();

  // State for form input values
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');

  const {
    runContractFunction: registerRestaurant,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: rmAddress,
    functionName: "registerRestaurant",
    params: {
        name: restaurantName,
        location: restaurantAddress
    }
  });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerRestaurant({
      params: { 'name': restaurantName, 'address': restaurantAddress },
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Register Restaurant</h1>
      {rmAddress ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Restaurant Name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Restaurant Address"
              value={restaurantAddress}
              onChange={(e) => setRestaurantAddress(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              type="submit"
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
              ) : (
                "Register Restaurant"
              )}
            </button>
          </form>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
}