import { createPublicClient, createWalletClient, custom, http, parseTransaction } from "viem";
import { celoAlfajores } from "viem/chains";
import { bookStoreAddress } from "@/utils/addresses/bookstoreContractAddress";
import { bookStoreAddressABI } from "@/utils/abis/bookStoreContractABI";


export const makeCreatingUser = async (
    _signerAddress: `0x${string}` | undefined,
): Promise<boolean> => {
    if (window.ethereum) {
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
            try {
                const createUserTxnHash = await privateClient.writeContract({
                    account: address,
                    address: bookStoreAddress,
                    abi: bookStoreAddressABI,
                    functionName: "makeCreatingUser",
                });

                const createUserTxnReceipt = await publicClient.waitForTransactionReceipt({
                    hash: createUserTxnHash
                });

                if (createUserTxnReceipt.status == "success") {
                    await publicClient.readContract({
                        address: bookStoreAddress as `0x${string}`,
                        abi: bookStoreAddressABI,
                        functionName: "getUserByWalletAddress",
                        args: [_signerAddress],
                    });
                    return true;
                }
                return false;
            } catch (err) {
                console.error(err);
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    return false;
};


