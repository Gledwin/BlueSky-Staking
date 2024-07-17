import { useState, useRef } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { parseUnits } from "viem";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakeTokenAddress } from "@/utils/addresses/stakeContractAddress";
import { stakeABI } from "@/utils/abis/stakeTokenABI";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";

const TokenApproval = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const approvedTokenRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          args: [stakingContractAddress, amountToSend],
        });

        setTransactionStatus("Transaction is pending...");
        onOpen();
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
        setTransactionStatus("Token approval failed");
        onOpen();
      }
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto" mt={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={approveToken}>
        <FormControl id="approve-amount">
          <FormLabel>Token Approve</FormLabel>
          <Input
            ref={approvedTokenRef}
            type="text"
            color="black"
            bg="yellow.200"
            _placeholder={{ color: 'gray.500' }}
          />
        </FormControl>
        <Button mt={4} type="submit" colorScheme="teal">Token Approve</Button>
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

export default TokenApproval;
