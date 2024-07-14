"use client";
import { Modal, message, Skeleton, Steps, theme, Tooltip } from "antd";
import formstyle from "./stepfrom.module.css";
import { isAddress } from "viem";

const FirstStep = ({
  handleInputChange,
  handleChainChange,
  contractAddress,
  selectedChain,
  setStoredAddress,
  setCurrent,
  current,
}) => {
  const handleCheck = async () => {
    console.log("first");
    if (contractAddress === "") {
      message.info("Please enter contract address");
      return;
    }
    if (selectedChain === undefined) {
      message.info("Please Select Chain ID");
      return;
    }
    if (!isAddress(contractAddress)) {
      message.info("Not an Valid Address");
      return;
    }

    setStoredAddress(contractAddress);

    try {
      // const abi = await getContractABI(contractAddress);
      // console.log(abi);
      // if (abi === "unverified") {
      //   message.info("Contract not verified");
      //   return;
      // }

      // // const contract = new ethers.Contract(contractAddress, abi, provider);
      // const isUpgradable = isUpgradableContract(abi);

      setCurrent(current + 1);

      message.info("Fetching Token Details");
    } catch (error) {
      console.error("Error analyzing contract:", error);
      message.info("Contract not verified");
    }
  };

  const getContractABI = async (address) => {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      console.log(data);

      if (data.status === "1") {
        return JSON.parse(data.result);
      } else if (data.result === "Contract source code not verified") {
        return "unverified";
      } else {
        throw new Error("Failed to fetch ABI");
      }
    } catch (error) {
      console.error("Error fetching ABI:", error);
      return null;
    }
  };

  const isUpgradableContract = (abi) => {
    const upgradableFunctions = [
      "upgradeTo",
      "upgradeToAndCall",
      "setImplementation",
      "_setPendingImplementation",
      "_acceptImplementation",
      "_setPendingAdmin",
      "_acceptAdmin",
    ];
    return abi.some(
      (item) =>
        item.type === "function" && upgradableFunctions.includes(item.name)
    );
  };

  return (
    <div className={formstyle.maindivcontent1}>
      <div className={formstyle.titledivfor1}>
        <h3>Enter Contract Address to Discover Locked Tokens!</h3>
      </div>
      <div className={formstyle.divbtninput}>
        <div className={formstyle.inputbuttondiv}>
          <Tooltip title="Select Chain">
            <select
              className={formstyle.selectDropdown}
              value={selectedChain}
              onChange={handleChainChange}
            >
              <option value={1}>Ethereum</option>
              <option value={10}>Optimism</option>
              <option value={42161}>Arbitrum</option>
            </select>
          </Tooltip>
        </div>
        <div className={formstyle.inputbuttondiv}>
          <Tooltip title="Enter Contract Address">
            <input
              className={formstyle.inputField}
              placeholder="0x178fDD70ba80D9CbDe941890519D3227c0051fdd"
              value={contractAddress}
              onChange={handleInputChange}
            />
          </Tooltip>
        </div>

        <div>
          <Tooltip title="Click here to check Locked tokens">
            <button className={formstyle.buttonin1step} onClick={handleCheck}>
              Check
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
