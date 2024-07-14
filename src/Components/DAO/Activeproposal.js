"use client";
import React, { useState, useEffect } from "react";
import propstyle from "./proposals.module.css";
import Modal from "react-modal";
import { Modal as AntdModal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, message, Skeleton, Empty } from "antd";
import TransactionsModalContent from "./TransactionsModalContent";

function Activeproposal({ data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState();

  //   const addresses = selectedData?.addresses || [];
  //   const tokenName = selectedData?.tokenName || "";
  //   const chainId = selectedData?.chainId || "";

  //   // Filtered addresses based on search query
  //   const filteredAddresses = addresses.filter((transaction) =>
  //     (transaction.from || "").toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   // Safe formatting function
  //   const safeFormatUnits = (amount, decimals) => {
  //     try {
  //       return (+formatUnits(amount, decimals)).toFixed(4);
  //     } catch (error) {
  //       console.error("Error formatting units:", error);
  //       return "0.0000";
  //     }
  //   };

  //   return (
  //     <div className="w-full max-w-3xl mx-auto">
  //       {!showTransaction ? (
  //         <div className="p-6">
  //           <h2 className="text-2xl font-bold mb-6">
  //             Addresses of Token Holder and Amount Locked
  //           </h2>
  //           <input
  //             type="text"
  //             placeholder="Search address"
  //             value={searchQuery}
  //             onChange={(e) => setSearchQuery(e.target.value)}
  //             className="mb-6 p-3 border border-gray-300 rounded w-full"
  //           />
  //           <div className="max-h-96 overflow-y-auto">
  //             <div className="grid grid-cols-3 gap-4 font-semibold mb-4 px-4">
  //               <div>Address</div>
  //               <div>Amount</div>
  //               <div>Actions</div>
  //             </div>
  //             {filteredAddresses.map((transaction, index) => (
  //               <div
  //                 key={index}
  //                 className={`grid grid-cols-3 gap-4 py-3 px-4 ${
  //                   index % 2 === 0 ? "bg-gray-100" : "bg-white"
  //                 }`}
  //               >
  //                 <div className="text-gray-800 truncate">
  //                   {transaction.from || "N/A"}
  //                 </div>
  //                 <div className="text-gray-600">
  //                   {tokenName === "USDC"
  //                     ? safeFormatUnits(transaction.amount || "0", 6)
  //                     : safeFormatUnits(transaction.amount || "0", 18)}
  //                 </div>
  //                 <button
  //                   onClick={() => getTransactionHash(transaction)}
  //                   className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
  //                 >
  //                   View Transactions
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       ) : (
  //         <div className="p-6">
  //           <h2 className="text-2xl font-bold mb-6">Transactions</h2>
  //           <div className="max-h-96 overflow-y-auto mb-6">
  //             {(transactionHash || []).map((transaction, index) => (
  //               <div className="text-gray-800 mb-4" key={transaction}>
  //                 Transaction {index + 1}
  //                 <a
  //                   href={`${explorerLinks[chainId] || "#"}${transaction}`}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                   className="block mb-2 break-all text-blue-500 hover:text-blue-600"
  //                 >
  //                   {transaction}
  //                 </a>
  //               </div>
  //             ))}
  //           </div>
  //           <button
  //             onClick={() => setShowTransaction(false)}
  //             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
  //           >
  //             Back to Addresses
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  const chainName = {
    10: "Optimism",
    1: "Ethereum",
    42161: "Arbitrum",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const openModal = (data) => {
    setSelectedData(data);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedData(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.info("Copied to your Clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy text: ", err);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const filteredData = data?.filter(
        (item) =>
          item.tokenAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredData);
    }

    console.log(filteredData);
  }, [data]);

  return (
    <div className={propstyle.outerdivprop1}>
      <div className={propstyle.maindivofproposal1}>
        <div className={propstyle.headingprop}>Active Proposal</div>
        <div className={propstyle.searchbardiv}>
          <input
            type="text"
            placeholder="search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>
        <div className={propstyle.tablediv}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} block={true} />
          ) : filteredData && filteredData.length > 0 ? (
            <table>
              <thead className="text-center">
                <tr>
                  <th>Token Address</th>
                  <th>Token Name</th>
                  <th>Contract Address</th>
                  <th>Status</th>
                  <th>Explore</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.tokenAddress.substring(0, 6)}...
                      {item.tokenAddress.substring(
                        item.tokenAddress.length - 4
                      )}
                      <Tooltip title="copy">
                        <button
                          onClick={() => copyToClipboard(item.tokenAddress)}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </Tooltip>
                    </td>
                    <td>{item.tokenName}</td>
                    <td>
                      {item.contractAddress.substring(0, 6)}...
                      {item.contractAddress.substring(
                        item.contractAddress.length - 4
                      )}
                      <Tooltip title="copy">
                        <button
                          onClick={() => copyToClipboard(item.contractAddress)}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </Tooltip>
                    </td>
                    <td style={{ color: "#2EBF82", fontWeight: "800" }}>
                      <strong>{item.status}</strong>
                    </td>
                    <td>
                      <Tooltip title="Click to view proposal details">
                        <button
                          className="hover:font-bold"
                          onClick={() => openModal(item)}
                        >
                          View <strong>↗</strong>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty description="No Data Available" />
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Proposal Details"
        className={propstyle.modal}
        overlayClassName={propstyle.overlay}
      >
        {selectedData && (
          <div>
            <div className={propstyle.headinginpopup}>Proposal Details</div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>Contract Address</div>
              <div className={propstyle.titlecontent}>
                {selectedData.contractAddress}
              </div>
            </div>
            <div className="flex">
              <div className={propstyle.divdetail}>
                <div className={propstyle.titledetail}>Token Name</div>
                <div className={propstyle.titlecontent}>
                  {selectedData.tokenName}
                </div>
              </div>
              <div className={propstyle.divdetail}>
                <div className={propstyle.titledetail}>Status</div>
                <div className={propstyle.titlecontent}>
                  {selectedData.status}
                </div>
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>Token Address</div>
              <div className={propstyle.titlecontent}>
                {selectedData.tokenAddress}
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>TVL</div>
              <div className={propstyle.titlecontent}>
                {selectedData.totalAmount}
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>Total Holders</div>
              <div className={propstyle.titlecontent}>
                {selectedData.totalAccount}
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}> View Token Holders</div>
              <div className={propstyle.titlecontent}>
                <Tooltip title="Click here to view addresses with locked tokens and their amounts.">
                  <button text-blue-900 onClick={handleOpenModal}>
                    {/* <strong> */}
                    Token Holders ↗{/* </strong> */}
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>EAS schema UID</div>
              <div className={propstyle.titlecontent}>
                <a
                  href={`https://base-sepolia.easscan.org/schema/view/${selectedData.schemUid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click to view Schema
                </a>
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>Chain</div>
              <div className={propstyle.titlecontent}>
                {chainName[selectedData?.chainId]}
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>merkelRoot</div>
              <div className={propstyle.titlecontent}>
                {selectedData?.merkelRoot}
              </div>
            </div>
            <div className="flex justify-around">
              {/* <button className={propstyle.buttonin2step}>Accept</button>
              <button className={propstyle.buttonin3step} onClick={closeModal}>Close</button> */}
            </div>
          </div>
        )}
      </Modal>
      <AntdModal
        title=""
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        className="modal"
        bodyStyle={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <TransactionsModalContent selectedData={selectedData} />
      </AntdModal>
    </div>
  );
}

export default Activeproposal;
