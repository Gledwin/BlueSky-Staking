import { useState, useEffect } from "react";
import { getStakingData } from "@/services/staking"; // Update the import path as necessary
import { useAccount } from "wagmi";

const EarnedRewards = () => {
  const { address } = useAccount();
  const [earnedRewards, setEarnedRewards] = useState("0.0000");

  useEffect(() => {
    const fetchStakedBalance = async () => {
      if (!address) return;

      try {
        const stakingData = await getStakingData(address as `0x${string}`);
        if (stakingData) {
          // Ensure the earned rewards are converted to a number and formatted to 4 decimal places
          const formattedAmount = (Number(stakingData.earnedRewards) / 1e18).toFixed(2);
          setEarnedRewards(formattedAmount);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchStakedBalance();
  }, [address]);



  return (
    <>
      <p>Earned rewards: {earnedRewards} tokens</p>
    </>
  );
}

export default EarnedRewards;
