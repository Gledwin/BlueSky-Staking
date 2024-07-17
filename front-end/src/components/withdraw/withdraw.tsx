import { useState, useRef } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { parseUnits } from "viem";
import { createWalletClient, createPublicClient, custom } from "viem";
import { celoAlfajores } from "viem/chains";
import { stakeTokenAddress } from "@/utils/addresses/stakeContractAddress";
import { stakingContractAddress } from "@/utils/addresses/stakingContractAddress";
import { stakingABI } from "@/utils/abis/stakingContractABI";

const Withdraw = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const withdrawAmountRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        onOpen();
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
        setTransactionStatus("Withdrawal failed");
        onOpen();
      }
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto" mt={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleWithdraw}>
        <FormControl id="withdraw-amount">
          <FormLabel>Withdraw Tokens</FormLabel>
          <Input
            ref={withdrawAmountRef}
            type="text"
            color="black"
            bg="yellow.200"
            _placeholder={{ color: 'gray.500' }}
          />
        </FormControl>
        <Button mt={4} type="submit" colorScheme="teal">Withdraw</Button>
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

export default Withdraw;
