'use client';

import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { ethers, isAddress } from "ethers";
import edx_abi from "../../abi/edx.json";
import { useAppKitProvider, type Provider } from "@reown/appkit/react";

const edx_address = "0xC114678C6e4654d041B2006C90f08478b444c4E2";
type SendTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTransactionComplete?: () => void;
};

export function SendTransactionModal({
  isOpen,
  onClose,
  onTransactionComplete = () => {},
}: SendTransactionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>("");
  const [recipientError, setRecipientError] = useState<string>("");

  useEffect(() => {
    setIsFormValid(amount.trim() !== "" && recipient.trim() !== "");
  }, [amount, recipient]);

  if (!isOpen) return null;

  const sendEDX = async () => {
    setAmountError("");
    setRecipientError("");

    if (!amount.trim() && !recipient.trim()) {
      setAmountError("Amount is required");
      setRecipientError("Recipient is required");
      return;
    }

    try {
      if (!walletProvider) return;

      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(edx_address, edx_abi, signer);
      if (!contract || !amount || !recipient) return;
      const amountInWei = ethers.parseUnits(amount, 18);
      const txn = await contract.transfer(recipient, amountInWei);
      await txn.wait();
      if (txn) {
        onTransactionComplete();
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setRecipient(clipboardText);
      if (clipboardText.trim() !== "") {
        setRecipientError("");
      }
    } catch (error) {
      setRecipientError((error as string) || "Failed to paste");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setAmountError("");
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    setRecipientError("");
    if (!isAddress(value)) {
      setRecipientError("Invalid Ethereum address");
    } else {
      setRecipientError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                onClose();
                setAmount("");
                setRecipient("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Amount input */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="text-4xl font-bold bg-transparent outline-none w-1/2 text-gray-900"
              placeholder="0"
            />
            <div className="flex justify-space-between items-center gap-1">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/200x200/23192.png"
                alt="EDX"
                className="h-5 w-5 rounded-full"
              />
              EDX
            </div>
          </div>

          {/* Arrow divider */}
          <div className="relative mb-6">
            <div className="border-t border-gray-200 w-full"></div>
            {amountError && (
              <p className="text-red-500 text-sm">{amountError}</p>
            )}
          </div>

          {/* Recipient address input */}
          <div className="bg-gray-100 p-4 rounded-xl mb-4 flex items-center">
            <input
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              className="bg-transparent outline-none flex-1 text-gray-600"
              placeholder="Type or paste address"
            />
            <Button
              variant="primary"
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-1 px-3 py-1"
              onClick={handlePaste}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </Button>
          </div>
          <div className="flex">
            {recipientError && (
              <span className="text-red-500 text-sm mb-1">
                {recipientError}
              </span>
            )}
          </div>
          {/* Token selection button */}
          <Button
            onClick={() => sendEDX()}
            className={`w-full py-3 font-medium border-0 ${
              isFormValid
                ? "bg-gray-800 hover:bg-gray-600 text-white"
                : "bg-gray-400 text-gray-400"
            }`}
            // disabled={!isFormValid}
          >
            Send EDX
          </Button>
        </div>
      </div>
    </div>
  );
}
