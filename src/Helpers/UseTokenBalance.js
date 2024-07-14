import { WebSocketProvider, ethers, formatUnits } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const RPC = {
  1: "https://eth-mainnet.g.alchemy.com/v2/zfBCiqBcZwblbUR4xvQUO5FVEYvkVdQ-",
  10: "https://opt-mainnet.g.alchemy.com/v2/9WBG_MVRsmOhaR5bEVKYclPwb_q9tIiw",
  42161:
    "https://arb-mainnet.g.alchemy.com/v2/9WBG_MVRsmOhaR5bEVKYclPwb_q9tIiw",
};

export const getTokenBalance = async (tokenAddress, walletAddress, chainId) => {
  if (!window.ethereum) {
    console.error("MetaMask (or another Web3 provider) not detected");
    return "No provider";
  }

  try {
    const provider = new WebSocketProvider(RPC[chainId]);

    const erc20Contract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );
    const balance = await erc20Contract.balanceOf(walletAddress);
    const decimal = await erc20Contract.decimals();
    console.log("Token balance:", balance.toString());

    let formattedBalance = formatUnits(balance, decimal);
    console.log("Formatted balance before rounding:", formattedBalance);

    // Round off the formatted balance to two decimal places using toFixed()
    formattedBalance = parseFloat(formattedBalance).toFixed(2);
    console.log("Formatted balance after rounding:", formattedBalance);
    return formattedBalance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return "Error";
  }
};
