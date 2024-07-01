"use client";
import React, { useState } from "react";
import AddressList from "../../Components/Check/checkAddress"; // Ensure the correct path to your component
import formstyle from "../../Components/SubmitDao/stepfrom.module.css";
import { useAccount, useConnect } from "wagmi";
import { message } from "antd";

function MainPage() {
  const [showWalletConnect, setShowWalletConnect] = useState(true);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const [tokens, setTokens] = useState([]);
  const [showAddressList, setShowAddressList] = useState(false);
  const [isValid, setIsValid] = useState(null);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };
  const fetchDataFromApi = async (address) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user?address=${address}`
      );
      const data = await response.json();
      console.log(data);
      if (data.tokens && data.tokens.length > 0) {
        setTokens(data.tokens);
        setShowAddressList(true);
        console.log("first");
      } else if (data.message === "User not found for the specified address") {
        message.info("No Attestation or Claims Available at the moment");
        console.log("first");
        setIsValid(false);
      } else {
        message.info("No Attestation or Claims Available at the moment");

        setIsValid(false);
      }
      console.log(data); // Log the fetched data to the console
    } catch (error) {
      console.error("Error fetching data from API:", error);
      message.error("Failed to fetch data from API");
      setIsValid(false);
    }
  };

  const handleCheckAddress = () => {
    fetchDataFromApi(address);
    setShowWalletConnect(false);
  };

  const handleGoBack = () => {
    setShowAddressList(false);
    setIsValid(null);
    setTokens([]);
    setShowWalletConnect(true);
  };

  const handleAddressBtnClick = () => {
    fetchDataFromApi(address);
  };

  return (
    <div className="maindiv flex justify-center items-center min-h-screen py-4">
      <div
        className={`${formstyle.checkpage} w-full lg:w-3/4 xl:w-2/3 bg-white px-4 py-4 md:px-8 md:py-8 rounded-3xl shadow-2xl text-center h-auto mt-12`}
      >
        <div className="text-gray-900 text-4xl font-bold p-4 m-2 w-full text-center">
          <h1>Token Resurrection</h1>
        </div>
        {showWalletConnect ? (
          <div className="flex flex-col md:flex-row justify-center items-center w-full">
            {isConnected ? (
              <button
                onClick={handleAddressBtnClick}
                className={`${formstyle.buttonin1step} m-2 w-full md:w-auto`}
              >
                {address.substring(0, 5)}...
                {address.substring(address.length - 5)}
              </button>
            ) : (
              <button
                className={`${formstyle.buttonin1step} m-2 w-full md:w-auto`}
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </button>
            )}
            <span className="mx-2 font-semibold text-2xl text-gray-900">
              or
            </span>
            <button
              className={`${formstyle.btncheck} m-2 w-full md:w-auto`}
              onClick={handleCheckAddress}
            >
              Check Address
            </button>
          </div>
        ) : (
          <AddressList onGoBack={handleGoBack} tokens={tokens} />
        )}
      </div>
    </div>
  );
}

export default MainPage;
