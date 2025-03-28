'use client';

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { modal } from "../../context/index";

import {
  useAppKitAccount,
  useAppKitProvider,
  type Provider,
} from "@reown/appkit/react";
import { formatEther, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { SendTransactionModal } from "@/components/modals/SendTransactionModal";
import edx_abi from "../../abi/edx.json";

// For now these are placeholders
const txns: any[] = [];
const address = "";
const bal = "0";

// import edx_abi from "../abi/edx.json";
const edx_address = "0xC114678C6e4654d041B2006C90f08478b444c4E2";
const API_KEY = process.env.NEXT_PUBLIC_APP_POLYGON_SCAN_API;

export default function DashboardPage() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const { address } = useAppKitAccount(); //get address here
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const [bal, setBalance] = useState("0");
  interface Transaction {
    to: string;
    value: string;
    tokenSymbol: string;
    timeStamp: number;
  }

  const [txns, setTxns] = useState<Transaction[]>([]);

  const handleGetBalance = useCallback(async () => {
    try {
      if (!walletProvider || !address) {
        setBalance("0");
        setTxns([]);
        return;
      }
      const provider = new ethers.BrowserProvider(walletProvider);
      // const signer = await provider.getSigner()
      const contract = new ethers.Contract(edx_address, edx_abi, provider);
      const balance = await contract.balanceOf(address);
      if (!balance) return;
      const bal = formatEther(balance);
      const fixed = Number(bal).toFixed(4);
      setBalance(fixed);
    } catch (error) {
      console.error(error);
    }
  }, [walletProvider, address]);

  //Fetch transactions from Etherscan
  const fetchTransactions = useCallback(async () => {
    if (!API_KEY) throw new Error("API_KEY is not defined");
    if (!walletProvider) return;
    // eslint-disable-next-line prefer-const
    let user = address;
    const url = `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=${edx_address}&address=${user}&sort=desc&apikey=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTxns(data.result);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [walletProvider, address, API_KEY]);

  const refreshData = useCallback(() => {
    fetchTransactions();
    handleGetBalance();
  }, [fetchTransactions, handleGetBalance]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-8 w-full">
      <SendTransactionModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onTransactionComplete={refreshData}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white"></h1>
        <div className="flex items-center gap-2">
          <appkit-button />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 h-full">
        {/* First card - full width on mobile, responsive on larger screens */}
        <div className="w-full h-full">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl w-full h-full">
            <div className="mb-2 text-yellow-300 font-medium">
              Current Balance
            </div>
            <div className="text-4xl font-bold">
              {`${bal}`} {"EDX"}
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold"
                onClick={() => setIsSendModalOpen(true)}
                disabled={!address}
              >
                {address ? "Send" : "Connect your Wallet first to Send EDX"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Second card - full width on mobile, responsive on larger screens */}
        <div className="w-full h-full">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl w-full h-full">
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">
              Network
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="text-sm text-gray-400">Current Network</div>
                <div className="font-medium text-white">Polygon Mainnet</div>
              </div>
              <Button
                onClick={() => {
                  //   modal.open({ view: "Networks" });
                }}
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-500 hover:bg-gray-800 w-full sm:w-auto"
              >
                Switch Network
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Card className="bg-gray-900 text-white shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-yellow-300">
          Recent Transactions
        </h3>
        <div className="overflow-x-auto -mx-6 px-6 pb-2">
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[80px]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[100px]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider min-w-[120px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {txns.length > 0 ? (
                  txns.slice(0, 5).map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white text-center">
                        {txn.to.toLowerCase() === address?.toLowerCase()
                          ? "Receive"
                          : "Sent"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400 text-center">
                        {`${ethers.formatEther(txn.value)} ${txn.tokenSymbol}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                        {new Date(txn.timeStamp * 1000).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-sm text-gray-300"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mt-4 block md:hidden">
          <h4 className="text-sm text-gray-400 mb-2">
            Mobile Transactions View
          </h4>
          <div className="space-y-3">
            {txns.length > 0 ? (
              txns.slice(0, 5).map((txn, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">
                      {txn?.to.toLowerCase() === address?.toLowerCase()
                        ? "Receive"
                        : "Send"}
                    </span>
                    <span className="text-green-400">
                      {`${ethers.formatEther(txn.value)} ${txn.tokenSymbol}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">
                      {new Date(txn.timeStamp * 1000).toLocaleString()}
                    </span>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                      Completed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-300 text-sm">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
