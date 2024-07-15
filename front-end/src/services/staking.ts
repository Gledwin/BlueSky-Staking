import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakingABI } from "@/utils/abis/stakingContractABI";

export const getStakingData = async (
  _signerAddress: `0x${string}` | undefined
): Promise<StakingData | null> => {
  let stakingData: StakingData | null = null;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });

    try {
      const [stakedBalance, rewards, earnedRewards, rewardRate] = await Promise.all([
        publicClient.readContract({
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "stakedBalance",
          args: [_signerAddress],
        }),
        publicClient.readContract({
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "rewards",
          args: [_signerAddress],
        }),
        publicClient.readContract({
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "earned",
          args: [_signerAddress],
        }),
        publicClient.readContract({
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "REWARD_RATE",
        }),
      ]);

      stakingData = {
        stakedBalance: Number(stakedBalance),
        rewards: Number(rewards),
        earnedRewards: Number(earnedRewards),
        rewardRate: Number(rewardRate),
      };

      return stakingData;
    } catch (err) {
      console.info(err);
      return stakingData;
    }
  }
  return null;
};

export type StakingData = {
  stakedBalance: number;
  rewards: number;
  earnedRewards: number;
  rewardRate: number;
};
