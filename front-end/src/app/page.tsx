"use client";

import {
  
  Text,
  Box,
  Flex,
  useToast,
  
  Badge,
} from "@chakra-ui/react";
import { useAccount, useConnect } from "wagmi";
import BecomeAUser from "./become-a-user/page";
import DisplayPanel from "@/components/DisplayPannel/DisplayPannel";
import TokenApproval from "@/components/navigation/tokenApproval";
import StakeAmount from "@/components/navigation/stakeAmount";
import WithdrawAmount from "@/components/withdraw/withdraw";
import Reward from "@/components/claimReward.tsx/claimReward";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { bookStoreUser } from '@/entities/bookStoreUser'
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { useEffect, useState } from "react";
import { injected } from "wagmi/connectors";


export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const toast = useToast();

  const [userAddress, setUserAddress] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const { connect } = useConnect();

  const { address, isConnected } = useAccount();

  const [bookStoreUser, setBookStoreUser] = useState<bookStoreUser | null>(null);


  




   
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
  }, [
    address,
    userExists,
    bookStoreUser,

  ]);

    const attemptConnection = async () => {
  if (window.ethereum && window.ethereum.isMiniPay) {
   connect({ connector: injected({ target: "metaMask" }) });
  }
 };

 
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>


  if (!isConnected) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Box bgColor={"#FFD62C"}>
          <Flex className="flex flex-col items-center justify-center" h={8}>
            <Text
              ml={4}
              textColor={"black"}
              noOfLines={1}
              paddingRight={4}
              alignContent={"center"}
              alignItems={"center"}
             onClick={attemptConnection}
            >
              {" "}
              Connected: <Badge>{isConnected.toString()}</Badge>
            </Text>
          </Flex>
        </Box>
      </main>
    );
  }

  // if (isLoading) {
  //   return (
  //     <main className="flex h-screen items-center justify-center">
  //       <Flex className="flex flex-col items-center" >
  //         <Text
  //           textColor={"black"}
  //           noOfLines={1}
  //           paddingRight={4}
  //           alignContent={"center"}
  //           alignItems={"center"}
  //         >
  //           Connected: {isConnected.toString()}
  //         </Text>
  //       </Flex>
  //       <Spinner />
  //     </main>
  //   );
  // }

  return (
    <>
      <Flex
        className="flex flex-col items-center justify-center"
        bgColor={"#FFD62C"}
        h={8}
      >
        <Text
          textColor={"black"}
          noOfLines={1}
          paddingRight={4}
          alignContent={"center"}
          alignItems={"center"}
        >
          Connected: <Badge>{isConnected.toString()}</Badge>
        </Text>
      </Flex>
      {userExists ? (
      
      <div className="p-10 bg-blue-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        BlueSky Staking-Rewards
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-200 p-4 rounded-md shadow-md">
          <DisplayPanel />
        </div>
        <div className="space-y-4">
          <div className="bg-blue-200 p-4 rounded-md shadow-sm">
            <StakeAmount />
          </div>
          <div className="border-t border-gray-400"></div>
          <div className="bg-blue-200 p-4 rounded-md shadow-sm">
            <WithdrawAmount />
          </div>
          <div className="border-t border-gray-400"></div>
          <div className="bg-blue-200 p-4 rounded-md shadow-sm">
            <TokenApproval />
          </div>
          <div className="border-t border-gray-400"></div>
          <div className="bg-blue-200 p-4 rounded-md shadow-sm">
            <Reward />
          </div>
        </div>
      </div>
    </div>
  
                
          

         
                   
      ) : (
        <BecomeAUser />
      )}
    </>
  );
}
