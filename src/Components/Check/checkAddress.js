import { useState } from 'react';
import AddressList from '../../Components/Check/addressList';
import formstyle from "../../Components/SubmitDao/stepfrom.module.css";

function AnotherComponent({ onGoBack }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [tokens, setTokens] = useState([]);

  const handleInputChange = (e) => {
    setWalletAddress(e.target.value);
    setIsValid(null);  // Reset validity state on input change
  };

  const fetchDataFromApi = async (address) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user?address=${address}`);
      const data = await response.json();
      if (data.tokens && data.tokens.length > 0) {
        setTokens(data.tokens);  // Set the token data
        setShowAddressList(true);
      } else {
        setIsValid(false);
      }
      console.log(data.tokens);  // Log the fetched data to the console
    } catch (error) {
      console.error('Error fetching data from API:', error);
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
    setWalletAddress('');
    setTokens([]);  // Reset the fetched data
  };

  return (
    showAddressList ? (
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
          placeholder={isValid === false ? 'Address is not valid!' : 'Enter wallet address'}
          className={`w-full px-3 py-2 border rounded mt-4 ${isValid === false ? 'border-red-700 border-2' : 'border-[#ffb320]'}`}
          style={{ borderColor: isValid === false ? 'red' : '#ffb320' }}
        />
        <div className="flex justify-between md:p-8 text-center">
          <button
            className={formstyle.buttonin11step}
            onClick={onGoBack}
          >
            Back to Home
          </button>
          <button
            className={formstyle.btncheck}
            onClick={checkAddress}
          >
            Check Address
          </button>
        </div>
      </div>
    )
  );
}

export default AnotherComponent;
