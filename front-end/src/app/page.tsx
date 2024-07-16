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
      <main className="flex h-screen items-center justify-center bg-black">
        <div className="bg-black p-4">
          <div className="flex flex-col items-center justify-center h-8">
            <p
              className="ml-4 text-white pr-4 text-center cursor-pointer"
              onClick={attemptConnection}
            >
              Connected: <span className="badge">{isConnected.toString()}</span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <p className="text-white pr-4 text-center">
            Connected: {isConnected.toString()}
          </p>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center bg-gray-900 p-4 w-full rounded-md shadow-md">
          <p>
            Connected: <span className="badge">{isConnected.toString()}</span>
          </p>
        </div>
        {userExists ? (
          <>
            <h1 className="text-4xl text-blue-500">BlueSky Staking-Rewards</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
              <div className="bg-blue-900 p-4 rounded-md shadow-md flex-1">
                <DisplayPanel />
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-blue-900 p-4 rounded-md shadow-md">
                  <StakeAmount />
                </div>
                <hr className="border-gray-400" />
                <div className="bg-blue-900 p-4 rounded-md shadow-md">
                  <WithdrawAmount />
                </div>
                <hr className="border-gray-400" />
                <div className="bg-blue-900 p-4 rounded-md shadow-md">
                  <TokenApproval />
                </div>
                <hr className="border-gray-400" />
                <div className="bg-blue-900 p-4 rounded-md shadow-md">
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
