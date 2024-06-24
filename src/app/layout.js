'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar/Navbar";
// import { ReactNode } from 'react';
// import { base } from 'viem/chains';
// import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider, createConfig, http } from 'wagmi';
// import { baseSepolia } from 'wagmi/chains';
// import { coinbaseWallet } from 'wagmi/connectors';
const inter = Inter({ subsets: ["latin"] });

// const wagmiConfig = createConfig({
//   chains: [baseSepolia],
//   connectors: [
//     coinbaseWallet({
//       appChainIds: [baseSepolia.id],
//       appName: 'onchainkit',
//     }),
//   ],
//   ssr: true,
//   transports: {
//     [baseSepolia.id]: http(),
//   },
// });

 const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        {/* <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={QueryClient}>
       <OnchainKitProvider apiKey="YOUR_PUBLIC_API_KEY" chain={base}> */}
      
      <body className={inter.mainbody}>
        <Navbar/>
        {children}</body>
    {/* </OnchainKitProvider>
    </QueryClientProvider>
    </WagmiProvider> */}
    </html>
  );
}
