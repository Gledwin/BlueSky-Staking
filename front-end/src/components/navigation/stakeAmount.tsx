import { useState, useRef } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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

        // Fetch the approved amount
        const approvedAmount = await publicClient.readContract({
          address: stakeTokenAddress,
          abi: stakeABI,
          functionName: "allowance",
          args: [address, stakingContractAddress],
        }) as bigint;

        if (BigInt(amountToSend) > approvedAmount) {
          console.error("Staking amount must be less than or equal to the approved amount");
          return;
        }

        // Call the stake function
        const stakeTxHash = await privateClient.writeContract({
          account: address,
          address: stakingContractAddress,
          abi: stakingABI,
          functionName: "stake",
          args: [amountToSend],
        });

        setTransactionStatus("Staking transaction is pending...");
        onOpen();
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
        setTransactionStatus("Staking failed");
        onOpen();
      }
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto" mt={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleStake}>
        <FormControl id="stake-amount">
          <FormLabel>Stake Tokens</FormLabel>
          <Input
            ref={stakeAmountRef}
            type="text"
            color="black"
            bg="yellow.200"
            _placeholder={{ color: 'gray.500' }}
          />
        </FormControl>
        <Button mt={4} type="submit" colorScheme="teal">Stake</Button>
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

export default Staking;
