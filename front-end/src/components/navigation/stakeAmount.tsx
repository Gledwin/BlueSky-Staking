import { useState, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { parseUnits } from "viem";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakeTokenAddress } from "@/utils/addresses/stakeContractAddress";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakeABI } from "@/utils/abis/stakeTokenABI";
import { stakingABI } from "@/utils/abis/stakingContractABI";

const Staking = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const stakeAmountRef = useRef<HTMLInputElement>(null);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stakeAmountRef.current) {
      const amount = stakeAmountRef.current.value.trim();
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

        // Call the stake function
        const stakeTxHash = await privateClient.writeContract({
          account: address,
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "stake",
          args: [amountToSend],
        });

        setTransactionStatus("Staking transaction is pending...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash: stakeTxHash });

        if (receipt.status === "success") {
          setTransactionStatus("Staking transaction is successful");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          setTransactionStatus("Staking transaction failed");
        }
      } catch (error) {
        console.error("Staking failed", error);
      }
    }
  };

  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={handleStake}>

        <label>Stake Tokens: </label>
        <input ref={stakeAmountRef} type="text" style={{ color: "black" }}/>
        <br/>
        <br/>
        <Button type="submit">Stake</Button>
      </form>
    </div>
  );
};

export default Staking;
