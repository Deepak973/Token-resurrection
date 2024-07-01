"use client";
import React, { useState, useEffect } from "react";
import Activeproposal from "./Activeproposal";
import Rejectedproposal from "./Rejectedproposals";
import Completedproposal from "./Completedproposal";
import tabstyle from "./alltabs.module.css";
import axios from "axios";

const Alltabs = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [data, setData] = useState([]);
  const [dataMessage, setDataMessage] = useState("");

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      if (data.length === 0) {
        setDataMessage("No data available.");
        setData([]);
      } else {
        setDataMessage("");
        setData(data);
      }
      console.log(data); // Logging data to console
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataMessage("Error fetching data.");
    }
  };

  const handleActiveClick = () => {
    setActiveTab("1");
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposals/status/active`
    );
  };

  const handleCompletedClick = () => {
    setActiveTab("2");
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposals/status/approved`
    );
  };

  const handleRejectedClick = () => {
    setActiveTab("3");
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposals/status/rejected`
    );
  };

  useEffect(() => {
    handleActiveClick();
  }, []);

  return (
    <div className={tabstyle.container}>
      <div className={tabstyle.tabHeaders}>
        <button
          className={`${tabstyle.tabButton1} ${
            activeTab === "1" ? tabstyle.active : ""
          }`}
          onClick={handleActiveClick}
        >
          Active Proposals
        </button>
        <button
          className={`${tabstyle.tabButton2} ${
            activeTab === "2" ? tabstyle.active : ""
          }`}
          onClick={handleCompletedClick}
        >
          Submitted Proposals
        </button>
        <button
          className={`${tabstyle.tabButton3} ${
            activeTab === "3" ? tabstyle.active : ""
          }`}
          onClick={handleRejectedClick}
        >
          Rejected Proposals
        </button>
      </div>
      <div className={tabstyle.tabContent}>
        {dataMessage && <p>{dataMessage}</p>}
        {activeTab === "1" && <Activeproposal data={data} />}
        {activeTab === "2" && <Completedproposal data={data} />}
        {activeTab === "3" && <Rejectedproposal data={data} />}
      </div>
    </div>
  );
};

export default Alltabs;
