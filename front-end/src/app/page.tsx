"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import BecomeAUser from "./become-a-user/page";
import DisplayPanel from "@/components/DisplayPannel/DisplayPannel";
import TokenApproval from "@/components/navigation/tokenApproval";
import StakeAmount from "@/components/navigation/stakeAmount";
import WithdrawAmount from "@/components/withdraw/withdraw";
import Reward from "@/components/claimReward.tsx/claimReward";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { bookStoreUser } from "@/entities/bookStoreUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { injected } from "wagmi/connectors";

export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const [bookStoreUser, setBookStoreUser] = useState<bookStoreUser | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    const fetchUserByWalletAddress = async () => {
      const fetchedBookStoreUser = await getUserByWalletAddress(address, {
        _walletAddress: address as `0x${string}`,
      });

      setBookStoreUser(fetchedBookStoreUser);
    };

    checkIfUserExistsAndSet();
    fetchUserByWalletAddress();
  }, [address, userExists, bookStoreUser]);

  const attemptConnection = async () => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  if (!isConnected) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-4">
           
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <p className="text-gray-700">Loading...</p>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-8">
      <div className="space-y-12">
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-full">
          <p>
            Connected: <span className="badge">{isConnected.toString()}</span>
          </p>
        </div>
        {userExists ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
                <DisplayPanel />
              </div>
              <div className="space-y-6 col-span-1">
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <StakeAmount />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <WithdrawAmount />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <TokenApproval />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <Reward />
                </div>
              </div>
            </div>
          </>
        ) : (
          <BecomeAUser />
        )}
      </div>
    </div>
  );
}
