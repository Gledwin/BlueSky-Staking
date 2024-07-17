import { useState, useEffect } from "react";
import { getStakingData } from "@/services/staking"; // Update the import path as necessary
import { useAccount } from "wagmi";

const StakedAmount = () => {
  const { address } = useAccount();
  const [stakedAmount, setStakedAmount] = useState("0.00");

  useEffect(() => {
    const fetchStakedBalance = async () => {
      if (!address) return;

      try {
        const stakingData = await getStakingData(address as `0x${string}`);
        if (stakingData) {
          const formattedAmount = (Number(stakingData.stakedBalance) / 1e18).toFixed(2);
          setStakedAmount(formattedAmount);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchStakedBalance();
  }, [address]);

  return (
    <>
      <div>Staked amount: {stakedAmount}</div>
    </>
  );
};

export default StakedAmount;
