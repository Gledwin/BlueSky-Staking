import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakingABI } from "@/utils/abis/stakingContractABI";
import { useAccount } from "wagmi";
import { rewardTokenAddress } from "@/utils/addresses/rewardContract";
import { rewardTokenABI } from "@/utils/abis/rewardTokenABI";

const ClaimRewards = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const { address } = useAccount();

  const handleClaimRewards = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const privateClient = createWalletClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });

      // Get the user's address from the wallet client
      const [userAddress] = await privateClient.getAddresses();

  

      // Call the getReward function on the staking contract
      const claimTxHash = await privateClient.writeContract({
        account: userAddress,
        address: stakingContractAddress,
        abi: stakingABI,
        functionName: "getReward",
        args: [],
      });

      setTransactionStatus("Claim reward transaction is pending...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash: claimTxHash });

      if (receipt.status === "success") {
        setTransactionStatus("Claim reward transaction is successful");
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        setTransactionStatus("Claim reward transaction failed");
      }
    } catch (error) {
      console.error("Claim reward failed", error);
      setTransactionStatus("Claim reward failed, please try again");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };

  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={handleClaimRewards}>
        <Button type="submit">Claim rewards</Button>
      </form>
    </div>
  );
};

export default ClaimRewards;
