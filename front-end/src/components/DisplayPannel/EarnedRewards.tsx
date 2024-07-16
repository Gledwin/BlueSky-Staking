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
          const formattedRewards = Number(stakingData.earnedRewards).toFixed(2);
          setEarnedRewards(formattedRewards);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchStakedBalance();
  }, [address]);

  return (
    <>
      <p>Earned rewards: {earnedRewards}</p>
    </>
  );
}

export default EarnedRewards;
