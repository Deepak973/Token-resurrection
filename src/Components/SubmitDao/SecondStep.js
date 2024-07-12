"use client";
import { Modal, message, Skeleton, Steps, theme, Tooltip } from "antd";
import formstyle from "./stepfrom.module.css";
import TokenRow from "./TokenRow";

const SecondStep = ({
  storedAddress,
  onTokenSelect,
  tokens,
  selectedChain,
  setTotalamount,
  setHolderscount,
  setTransactions,
  setUSDC,
}) => {
  return (
    <div className={formstyle.maindivcontent2}>
      <div className={formstyle.titlediv2}>
        <h1>Discover Locked Tokens</h1>
      </div>
      <div className={formstyle.tablediv}>
        <table>
          <thead>
            <tr>
              <th>Token Name</th>
              <th>Token Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <TokenRow
                key={index}
                token={token}
                storedAddress={storedAddress}
                onSelect={onTokenSelect}
                selectedChain={selectedChain}
                setTotalamount={setTotalamount}
                setHolderscount={setHolderscount}
                setTransactions={setTransactions}
                setUSDC={setUSDC}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SecondStep;
