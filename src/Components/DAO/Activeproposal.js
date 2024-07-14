"use client";
import React, { useState, useEffect } from "react";
import propstyle from "./proposals.module.css";
import Modal from "react-modal";
import { Modal as AntdModal } from "antd";
import formstyle from "../SubmitDao/stepfrom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, message, Skeleton, Empty } from "antd";
import { formatUnits } from "viem";

function Activeproposal({ data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState();

  const TransactionsModalContent = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filtered addresses based on search query
    const filteredAddresses = selectedData.addresses.filter((transaction) =>
      transaction.from.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="p-4 max-h-80 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          Addresses of Token Holder and Amount locked
        </h2>
        <input
          type="text"
          placeholder="Search address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="space-y-2 font-bold">
          {filteredAddresses.map((transaction, index) => (
            <div
              key={index}
              className={`flex justify-between py-2 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="text-gray-800">
                {transaction.from} {/* Adjust length as needed */}
              </div>
              <div className="text-gray-600">
                {selectedData.tokenName === "USDC"
                  ? (+formatUnits(transaction.amount, 6)).toFixed(4)
                  : (+formatUnits(transaction.amount, 18)).toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const chainName = {
    10: "Optimism",
    1: "Ethereum",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = () => {
    console.log(":goinf");
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

  console.log(data);
  useEffect(() => {
    if (data.length > 0) {
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
          ) : filteredData.length > 0 ? (
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
        title="Explore Holders List"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        className="modal"
        bodyStyle={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <TransactionsModalContent />
      </AntdModal>
    </div>
  );
}

export default Activeproposal;
