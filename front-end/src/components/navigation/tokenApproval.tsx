import { useState, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { parseUnits } from "viem";
import { createWalletClient, createPublicClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakeTokenAddress } from "@/utils/addresses/stakeContractAddress";
import { stakeABI } from "@/utils/abis/stakeTokenABI";

const TokenApproval = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const approvedTokenRef = useRef<HTMLInputElement>(null);

  const approveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (approvedTokenRef.current) {
      const amount = approvedTokenRef.current.value.trim();
      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        console.error("Please enter a valid positive number");
        return;
      }
      const amountToSend = parseUnits(amount, 18).toString();
      try {
        const privateClient = createWalletClient({
          chain: celoAlfajores,
          transport: custom(window.ethereum),
        });

        const publicClient = createPublicClient({
          chain: celoAlfajores,
          transport: custom(window.ethereum),
        });

        const [address] = await privateClient.getAddresses();
        const transactionHash = await privateClient.writeContract({
          account: address,
          address: stakeTokenAddress,
          abi: stakeABI,
          functionName: "approve",
          args: [stakeTokenAddress, amountToSend],
        });

        setTransactionStatus("Transaction is pending...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });

        if (receipt.status === "success") {
          setTransactionStatus("Transaction is successful");
          setTimeout(() => {
            setTransactionStatus("");
          }, 5000);
          approvedTokenRef.current.value = "";
        } else {
          setTransactionStatus("Transaction failed");
        }
      } catch (error) {
        console.error("Token approval failed", error);
      }
    }
  };

  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={approveToken}>
        <label>Token Approve: </label>
        <input ref={approvedTokenRef} type="text" />
        <br/>
        <br/>
        <Button type="submit">Token Approve</Button>
      </form>
    </div>
  );
};

export default TokenApproval;
