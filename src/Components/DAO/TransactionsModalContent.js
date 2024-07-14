import { formatUnits } from "viem";
import styles from "./TransactionsModalContent.module.css";

import { useState } from "react";
import { message } from "antd";
import axios from "axios";

const TransactionsModalContent = ({ selectedData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionHash, setTranactionHash] = useState([]);
  const [showTransaction, setShowTransaction] = useState(false);

  const addresses = selectedData?.addresses || [];
  const tokenName = selectedData?.tokenName || "";
  const chainId = selectedData?.chainId || "";

  const filteredAddresses = addresses.filter((transaction) =>
    (transaction.from || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const explorerLinks = {
    1: "https://etherscan.io/tx/",
    10: "https://optimistic.etherscan.io/tx/",
    42161: "https://arbiscan.io/tx/",
  };
  const getTransactionHash = async (transaction) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposals/transactionhash?from=${transaction.from}&to=${selectedData.contractAddress}&token=${selectedData.tokenName}&chainId=${selectedData.chainId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data[0].txHash);
      setTranactionHash(response.data[0].txHash);
      setShowTransaction(true);
    } catch (error) {
      console.error("Error fetching data from API:", error);
      message.error("Failed to fetch data from API");
    }
  };

  return (
    <div className={styles.container}>
      {!showTransaction ? (
        <div className={styles.section}>
          <h2 className={styles.title}>
            Addresses of Token Holder and Amount Locked
          </h2>
          <input
            type="text"
            placeholder="Search address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
          />
          <div className={styles.list}>
            <div className={styles.header}>
              <div>Address</div>
              <div>Amount</div>
              <div>Actions</div>
            </div>
            {filteredAddresses.map((transaction, index) => (
              <div
                key={index}
                className={`${styles.row} ${
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd
                }`}
              >
                <div className={styles.address}>
                  {transaction.from || "N/A"}
                </div>
                <div className={styles.amount}>
                  {tokenName === "USDC"
                    ? (+formatUnits(transaction.amount || "0", 6)).toFixed(4)
                    : (+formatUnits(transaction.amount || "0", 18)).toFixed(4)}
                </div>
                <button
                  onClick={() => getTransactionHash(transaction)}
                  className={styles.button}
                >
                  View Transactions
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.section}>
          <h2 className={styles.title}>Transactions</h2>
          <div className={styles.list}>
            {(transactionHash || []).map((transaction, index) => (
              <div key={transaction}>
                Transaction {index + 1}
                <a
                  href={`${explorerLinks[chainId] || "#"}${transaction}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.transactionLink}
                >
                  {transaction}
                </a>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowTransaction(false)}
            className={styles.backButton}
          >
            Back to Addresses
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsModalContent;
