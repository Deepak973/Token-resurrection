"use client";
import React, { useState, useEffect } from "react";
import propstyle from "./proposals.module.css";
import Modal from "react-modal";
import formstyle from "../SubmitDao/stepfrom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Empty, Tooltip, message, Skeleton } from "antd";

function Rejectedproposal({ data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

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

  const filteredData = data.filter(
    (item) =>
      item.tokenAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    </div>
  );
}

export default Rejectedproposal;
