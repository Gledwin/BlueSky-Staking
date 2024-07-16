import { useState, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { parseUnits } from "viem";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakeTokenAddress } from "@/utils/addresses/stakeContractAddress";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakingABI } from "@/utils/abis/stakingContractABI";

const Withdraw = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const withdrawAmountRef = useRef<HTMLInputElement>(null);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmountRef.current) {
      const amount = withdrawAmountRef.current.value.trim();
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

        // Call the withdraw function
        const withdrawTxHash = await privateClient.writeContract({
          account: address,
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "withdraw",
          args: [amountToSend],
        });

        setTransactionStatus("Withdrawal transaction is pending...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash: withdrawTxHash });

        if (receipt.status === "success") {
          setTransactionStatus("Withdrawal transaction is successful");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          setTransactionStatus("Withdrawal transaction failed");
        }
      } catch (error) {
        console.error("Withdrawal failed", error);
      }
    }
  };

  return (
    <div>
      {transactionStatus && <div>{transactionStatus}</div>}
      <form onSubmit={handleWithdraw}>
        <label>Withdraw Tokens: </label>
        <input ref={withdrawAmountRef} type="text"style={{ color: "black" }} />
        <br/>
        <br/>
        <Button type="submit">Withdraw</Button>
      </form>
    </div>
  );
};

export default Withdraw;
