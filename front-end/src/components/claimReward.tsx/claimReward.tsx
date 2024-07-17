import { useState } from "react";
import { Box, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakingABI } from "@/utils/abis/stakingContractABI";
import { useAccount } from "wagmi";

const ClaimRewards = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      // Call the claim function on the staking contract (ensure the correct function name)
      const claimTxHash = await privateClient.writeContract({
        account: userAddress,
        address: stakingContractAddress,
        abi: stakingABI,
        functionName: "getReward", // Change this if the function name is different
        args: [],
      });

      setTransactionStatus("Claim reward transaction is pending...");
      onOpen();
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
      onOpen();
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto" mt={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleClaimRewards}>
        <Button mt={4} type="submit" colorScheme="teal">Claim rewards</Button>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{transactionStatus}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClaimRewards;
