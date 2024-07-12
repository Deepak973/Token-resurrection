"use client";
const { Tooltip, message } = require("antd");
import MerkleTree from "merkletreejs";
import propstyle from "../DAO/proposals.module.css";
import formstyle from "./stepfrom.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import FailureResult from "./FailureResult";
import SuccessResult from "./SuccessResult";
import AttestationDeployerABI from "../../ABI/TokenResurrectionFactoryABI.json";
import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  keccak256,
} from "viem";
import { useAccount } from "wagmi";
import { BrowserProvider, ethers } from "ethers";

const ThirdStep = ({
  handleOpenModal,
  getHolderscount,
  storedAddress,
  selectedToken,
  Totalamount,
  transactions,
  selectedChain,
}) => {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submssionProgress, setSubmissionProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { address } = useAccount();

  const publicClient = createPublicClient({
    chain: {
      id: 84532, // BTTC Donau testnet chain ID
      rpcUrls: {
        public: "https://base-sepolia.blockpi.network/v1/rpc/public", // BTTC Donau testnet RPC URL
      },
    },
    transport: http("https://base-sepolia.blockpi.network/v1/rpc/public"), // Passing RPC URL to http function
  });

  let walletClient;
  if (typeof window !== "undefined" && window.ethereum) {
    walletClient = createWalletClient({
      chain: {
        id: 84532, // BTTC Donau testnet chain ID
        rpcUrls: {
          public: "https://base-sepolia.blockpi.network/v1/rpc/public",
          websocket: "https://base-sepolia.blockpi.network/v1/rpc/public", // WebSocket URL (optional)
        },
      },
      transport: custom(window ? window.ethereum : ""),
    });
  }

  let provider;
  const setProvider = async () => {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
      console.log("going");
    } else {
      provider = new BrowserProvider(window.ethereum);

      return provider;
    }
    console.log(provider);
  };
  useEffect(() => {
    setProvider();
  }, []);

  const handleSubmit = async () => {
    if (!selectedToken) {
      console.error("No token selected to submit.");
      return;
    }
    setSubmitting(true);
    setSubmissionProgress("Initiated");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkproposals?tokenAddress=${selectedToken.tokenAddress}&contractAddress=${selectedToken.contractAddress}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("submission can be added");
    } else {
      setSubmissionStatus("error");
      setErrorMessage(response.message);
      message.info("Proposal Already exists");
      return;
    }
    try {
      console.log("trying to post");

      setSubmissionProgress("Generating Merkle Root");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(transactions);
      const addresses = transactions.map((transaction) => transaction.from);
      const leaves = addresses.map((addr) => keccak256(addr));
      console.log(leaves);

      // Create a Merkle tree
      const merkleTree = new MerkleTree(leaves, keccak256, {
        sortPairs: true,
        sortLeaves: true,
      });
      const root = merkleTree.getRoot().toString("hex");
      console.log(root);
      const merkelRootFinal = "0x" + root;

      console.log(merkelRootFinal);

      setSubmissionProgress("Deploying EAS Resolver");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { request } = await publicClient.simulateContract({
        account: address,
        address: "0x352349c1aF3f45faed79AEF9dA762BAEE02363cc",
        abi: AttestationDeployerABI.abi,
        functionName: "deploy",
        args: ["0x4200000000000000000000000000000000000021", merkelRootFinal], // Specify the gas limit here
      });

      const execute = await walletClient.writeContract(request);
      let resolverAddress = "";
      if (execute) {
        const tx = await publicClient.waitForTransactionReceipt({
          hash: execute,
        });
        const data = await publicClient.readContract({
          account: address,
          address: "0x352349c1aF3f45faed79AEF9dA762BAEE02363cc",
          abi: AttestationDeployerABI.abi,
          functionName: "getDeployedContracts",
        });

        resolverAddress = data[data.length - 1];
      }

      setSubmissionProgress("Registering Attestation Schema");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const SchemaUid = await registerSchema(resolverAddress);

      const Transactionobj = {
        merkelRoot: merkelRootFinal,
        selectedToken: selectedToken,
        ResolverAddress: resolverAddress,
        schemUid: SchemaUid,
        addresses,
        totalAmount: Totalamount,
        totalAccount: getHolderscount,
        chainId: selectedChain,
      };

      console.log(Transactionobj);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proposals`,
        Transactionobj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.status === 201) {
        console.log("Token submission successful!");
        setSubmissionStatus("success");
        message.info("Proposal  submission successful");
      } else {
        console.error("Token submission failed:", response.statusText);
        setSubmissionStatus("error");
        setErrorMessage(response.message);
        message.info("Proposal  submission failed");
      }
    } catch (error) {
      console.error("Error submitting token:", error.message);
      setSubmissionStatus("error");
      setErrorMessage(error.message);
      message.info("Error submitting proposal");
    } finally {
      setSubmitting(false);
    }
  };

  const registerSchema = async (resolverAddress) => {
    const schemaRegistryContractAddress =
      "0x4200000000000000000000000000000000000020";
    const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
    const provider = await setProvider();
    const signer = await provider.getSigner();
    schemaRegistry.connect(signer);
    const schema =
      "address lockedContractAddress, string aggrement, address recovertokenAddress ,string tokenSymbol, bytes proof";
    // Sepolia 0.26
    const revocable = false;

    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable,
    });

    await transaction.wait();
    console.log(transaction["receipt"]["logs"][0]["topics"][1]);
    return transaction["receipt"]["logs"][0]["topics"][1];
  };

  const handleReset = () => {
    setSubmissionStatus(null);
    setErrorMessage("");
  };

  if (submissionStatus === "success") {
    setSubmissionStatus("");
    return <SuccessResult onReset={handleReset} />;
  }

  if (submissionStatus === "error") {
    setSubmissionStatus("");
    return <FailureResult onReset={handleReset} message={errorMessage} />;
  }

  return (
    <div>
      <div className={formstyle.maindivof4}>
        <div className={formstyle.headingdiv}>
          <div className={formstyle.headingdiv1}>
            <span>Review & Submit.</span>
          </div>
          <div className={formstyle.headingdiv11}>
            Verify the details thoroughly to Create EAS Schema and deploy
            Resolver Address with the Merkel Root
          </div>
        </div>
        <div className={formstyle.tkdetailsdiv}>
          <div className={propstyle.divdetail}>
            <div className={propstyle.titledetail}>Contract Address</div>
            <div className={propstyle.titlecontent}>{storedAddress}</div>
          </div>

          <div className="flex">
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>Token Name</div>
              <div className={propstyle.titlecontent}>
                {selectedToken.tokenName}
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>Token Amount</div>
              <div className={propstyle.titlecontent}>
                {Totalamount ? Totalamount : "Loading..."}
              </div>
            </div>
            <div className={propstyle.divdetail}>
              <div className={propstyle.titledetail}>
                <Tooltip title="Click here to view addresses with locked tokens and their amounts.">
                  <button text-blue-900 onClick={handleOpenModal}>
                    {/* <strong> */}
                    Token Holders ↗{/* </strong> */}
                  </button>
                </Tooltip>
              </div>
              <div className={propstyle.titlecontent}>
                {getHolderscount ? getHolderscount : "Loading..."}
              </div>
            </div>
          </div>
          <div className={propstyle.divdetail}>
            <div className={propstyle.titledetail}>Token Address</div>
            <div className={propstyle.titlecontent}>
              {selectedToken.tokenAddress}
            </div>
          </div>
        </div>

        <div className={formstyle.buttondiv}>
          <button
            className={formstyle.buttonin1step}
            onClick={handleSubmit}
            loading={submitting}
            disabled={!selectedToken || submitting}
          >
            Submit
          </button>

          {submitting && (
            <div
              style={{ marginLeft: "10px", color: "green", fontSize: "14px" }}
            >
              {submssionProgress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThirdStep;
