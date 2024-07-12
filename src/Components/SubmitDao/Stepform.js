"use client";
import React, { useState, useEffect } from "react";
import { Modal, message, Steps, theme } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import formstyle from "./stepfrom.module.css";
import { formatUnits } from "viem";
import { BrowserProvider, ethers } from "ethers";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

const StepForm = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [contractAddress, setContractAddress] = useState("");
  const [storedAddress, setStoredAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [Totalamount, setTotalamount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [getHolderscount, setHolderscount] = useState("");
  const [isUSDC, setUSDC] = useState(false);
  const [selectedChain, setSelectedChain] = useState(1);
  const [tokens, setTokens] = useState([]);

  const ETHERSCAN_API_KEY = "JGWS1C3GSNW3GQYVU5AHMB5Y2I9KUI6YHW";

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const TransactionsModalContent = () => {
    // Function to truncate address
    const truncateAddress = (from, length) =>
      `${from.substring(0, length)}...${from.substring(
        from.length - length,
        from.length
      )}`;

    return (
      <div className="p-4 max-h-80 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Addresses of Token Holder and Amount locked{" "}
        </h2>
        <div className="space-y-2 font-bold">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className={`flex justify-between py-2 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="text-gray-800">
                {truncateAddress(transaction.from, 8)}{" "}
                {/* Adjust length as needed */}
              </div>

              {/* <div className="text-gray-600">{transaction.amount}</div> */}
              <div className="text-gray-600">
                {" "}
                {isUSDC
                  ? (+formatUnits(transaction.amount, 6)).toFixed(4)
                  : (+formatUnits(transaction.amount, 18)).toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setContractAddress(value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(Number(e.target.value));
  };

  useEffect(() => {
    let TOKENS = [];

    switch (selectedChain) {
      case 1:
        TOKENS = [
          {
            tokenName: "UNI",
            tokenAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          },
          {
            tokenName: "WETH",
            tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          },
          {
            tokenName: "USDC",
            tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          },
          {
            tokenName: "DAI",
            tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          },
        ];
        setTokens(TOKENS);
        break;
      case 10:
        TOKENS = [
          {
            tokenName: "OP",
            tokenAddress: "0x4200000000000000000000000000000000000042",
          },
        ];
        setTokens(TOKENS);
        break;
    }
  }, [selectedChain]);

  const handleTokenSelect = (tokenData) => {
    const Proposalobject = {
      tokenName: tokenData.tokenName,
      tokenAddress: tokenData.tokenAddress,
      contractAddress: storedAddress,
    };
    setSelectedToken(Proposalobject);
    console.log("Selected Token:", Proposalobject);
    message.info("Generating your Proposal!");
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: <div className={formstyle.steptitles}>Verify Address</div>,
      content: (
        <FirstStep
          handleInputChange={handleInputChange}
          handleChainChange={handleChainChange}
          contractAddress={contractAddress}
          selectedChain={selectedChain}
          setStoredAddress={setStoredAddress}
          setCurrent={setCurrent}
          current={current}
        />
      ),
      icon: <UserOutlined className={formstyle.customIcon} />,
    },
    {
      title: <div className={formstyle.steptitles}>Check Lock Token</div>,
      content: (
        <SecondStep
          storedAddress={storedAddress}
          onTokenSelect={handleTokenSelect}
          tokens={tokens}
          selectedChain={selectedChain}
          setTotalamount={setTotalamount}
          setHolderscount={setHolderscount}
          setTransactions={setTransactions}
          setUSDC={setUSDC}
        />
      ),
      icon: <UnorderedListOutlined className={formstyle.customIcon} />,
    },
    {
      title: <div className={formstyle.steptitles}>Submit for review</div>,
      content: (
        <ThirdStep
          handleOpenModal={handleOpenModal}
          getHolderscount={getHolderscount}
          storedAddress={storedAddress}
          selectedToken={selectedToken}
          Totalamount={Totalamount}
          transactions={transactions}
          selectedChain={selectedChain}
        />
      ),
      icon: <CheckCircleOutlined className={formstyle.customIcon} />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item, index) => ({
    key: item.title,
    title: <span className={formstyle.titleinsteps}>{item.title}</span>,
    icon: (
      <span className={index === current ? formstyle.currentIcon : ""}>
        {item.icon}
      </span>
    ),
    status: index === current ? "process" : index < current ? "finish" : "wait",
  }));

  const contentStyle = {
    minHeight: "400px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: "white",
    borderRadius: "46px",
    border: "none",
    marginTop: 36,
    boxShadow:
      "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
  };

  return (
    <div className={formstyle.mainndiv}>
      <Steps current={current} items={items} />
      <div className=" text-black" style={contentStyle}>
        {steps[current].content}
      </div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current > 0 && (
          <button className={formstyle.buttonin11step} onClick={() => prev()}>
            ← Previous
          </button>
        )}
      </div>
      <Modal
        title="Explore Holders List"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        className="modal"
        bodyStyle={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <TransactionsModalContent />
      </Modal>
    </div>
  );
};

export default StepForm;
