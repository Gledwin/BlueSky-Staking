import { useState, useEffect } from "react";
import { getStakingData } from "@/services/staking"; // Update the import path as necessary
import { useAccount } from "wagmi";



const RewardRate = () =>{
      const { address } = useAccount();
      const [stakedAmount, setStakedAmount] = useState("0");
      const [rewardRate, setRewardRate] = useState("0");
    
    
    
      useEffect(() => {
        const fetchStakedBalance = async () => {
          if (!address) return;
    
          try {
            const stakingData = await getStakingData(address as `0x${string}`);
            if (stakingData) {
              setRewardRate(stakingData.rewardRate.toString());

             
        }
          } catch (error) {
            console.log("Error fetching data:", error);
          }
        };
    
        fetchStakedBalance();
      }, [address]);
       
       

      
      return (
        <>
          <p>Reward rate: {rewardRate}</p>
        </>
      );
    };




export default RewardRate;