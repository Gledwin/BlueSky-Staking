import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakingABI } from "@/utils/abis/stakingContractABI";
import { useAccount } from "wagmi";

const ClaimRewards = () => {
  const { address } = useAccount();
  const [transactionStatus, setTransactionStatus] = useState("");

  const getRewards = async () => {
    if (!address) {
      console.error("No address found");
      return;
    }

    try {
      const privateClient = createWalletClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });

      // Call the claim function
      const claimTxHash = await privateClient.writeContract({
        account: address,
        address: stakingContractAddress,
        abi: stakingABI,
        functionName: "getReward",
        args: [],
      });

      setTransactionStatus("Claim transaction is pending...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash: claimTxHash });

      if (receipt.status === "success") {
        setTransactionStatus("Claim transaction is successful");
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        setTransactionStatus("Claim transaction failed");
      }
    } catch (error) {
      console.error("Claim failed", error);
      setTransactionStatus("Claim transaction failed");
    }
  };

  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <Button onClick={getRewards}>Claim Rewards</Button>
    </div>
  );
};

export default ClaimRewards;
