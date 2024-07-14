import { getTokenBalance } from "@/Helpers/UseTokenBalance";
import { Skeleton } from "antd";
import { useEffect, useState } from "react";
import formstyle from "./stepfrom.module.css";
import axios from "axios";
import { formatUnits } from "viem";

const TokenRow = ({
  token,
  storedAddress,
  onSelect,
  selectedChain,
  setTotalamount,
  setHolderscount,
  setTransactions,
  setUSDC,
}) => {
  const [balance, setBalance] = useState("Loading...");

  useEffect(() => {
    if (storedAddress) {
      console.log(token);
      getTokenBalance(token.tokenAddress, storedAddress, selectedChain).then(
        setBalance
      );
    }
  }, [storedAddress, token.tokenAddress]);

  const postTransaction = async (Transactionobj) => {
    try {
      setTotalamount("");
      setHolderscount("");
      setTransactions([]);

      const response = axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
        Transactionobj,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 180000,
        }
      );
      const res = await response;
      const data = res.data;
      console.log(data);

      setTotalamount(data.totalAmount);
      setTransactions(data.transactions);
      console.log(data.transactions);
      const gettnx = data.transactions;
      setHolderscount(gettnx.length);
      console.log(res);
      if (res.status === 200) {
        console.log("Transaction posted successfully!");
        if (data.totalAmount) {
          console.log(Transactionobj.token);
          if (Transactionobj.token == "USDC") {
            setUSDC(true);

            setTotalamount((+formatUnits(data.totalAmount, 6)).toFixed(4));
          } else {
            setUSDC(false);
            setTotalamount((+formatUnits(data.totalAmount, 18)).toFixed(4));
          }
        }
      } else {
        console.error("Transaction post failed:", data);
      }
    } catch (error) {
      console.error("Error posting transaction:", error.message);
    }
  };

  const handleRowClick = async () => {
    const tokenData = {
      tokenName: token.tokenName,
      tokenAddress: token.tokenAddress,
      balance: balance,
    };
    onSelect(tokenData);
    const Transactionobj = {
      token: token.tokenName,
      to: storedAddress,
      chainId: selectedChain,
    };
    await postTransaction(Transactionobj); // Call the new function here
  };

  return (
    <tr className={formstyle.trtagbody} onClick={handleRowClick}>
      <Skeleton
        loading={balance === "Loading..."}
        active
        paragraph={{ rows: 1, width: "100%" }}
      >
        <td>{token.tokenName}</td>
        <td>{token.tokenAddress}</td>
        <td>{balance}</td>
      </Skeleton>
    </tr>
  );
};

export default TokenRow;
