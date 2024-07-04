import { useState } from "react";
import AddressList from "../../Components/Check/addressList";
import formstyle from "../../Components/SubmitDao/stepfrom.module.css";
import { Button, Modal, message, Skeleton, Steps, theme, Tooltip } from "antd";
import axios from "axios";

function AnotherComponent({ onGoBack }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [tokens, setTokens] = useState([]);

  const handleInputChange = (e) => {
    setWalletAddress(e.target.value);
    setIsValid(null); // Reset validity state on input change
  };

  const fetchDataFromApi = async (address) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-transactions?user=${address}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status !== 200) {
        console.log("first");
        message.info("No Attestation or Claims Available at the moment");
      } else {
        console.log("goin in else");
        const data = response.data;
        console.log(data);
        if (data && data.length > 0) {
          console.log("first");
          setTokens(data); // Set the token data
          setShowAddressList(true);
        } else {
          setIsValid(false);
        }
        console.log(data);
      } // Log the fetched data to the console
    } catch (error) {
      console.error("Error fetching data from API:", error);
      setIsValid(false);
    }
  };

  const checkAddress = () => {
    // Fetch data from the API
    fetchDataFromApi(walletAddress);
  };

  const handleGoBack = () => {
    setShowAddressList(false);
    setIsValid(null);
    setWalletAddress("");
    setTokens([]); // Reset the fetched data
  };

  return showAddressList ? (
    <AddressList onGoBack={handleGoBack} tokens={tokens} />
  ) : (
    <div className="text-center flex flex-col justify-center h-full">
      <div className="text-gray-900 text-2xl font-bold p-4 m-4">
        <h2>Check Wallet Address</h2>
      </div>
      <input
        type="text"
        value={walletAddress}
        onChange={handleInputChange}
        placeholder={
          isValid === false ? "Address is not valid!" : "Enter wallet address"
        }
        className={`w-full px-3 py-2 border rounded mt-4 ${
          isValid === false ? "border-red-700 border-2" : "border-[#ffb320]"
        }`}
        style={{ borderColor: isValid === false ? "red" : "#ffb320" }}
      />
      <div className="flex justify-between md:p-8 text-center">
        <button className={formstyle.buttonin11step} onClick={onGoBack}>
          Back to Home
        </button>
        <button className={formstyle.btncheck} onClick={checkAddress}>
          Check Address
        </button>
      </div>
    </div>
  );
}

export default AnotherComponent;
