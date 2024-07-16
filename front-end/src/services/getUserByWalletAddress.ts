import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { bookStoreAddress } from "@/utils/addresses/bookstoreContractAddress";
import { bookStoreAddressABI } from "@/utils/abis/bookStoreContractABI";
import { bookStoreUser } from "@/entities/bookStoreUser";

export const getUserByWalletAddress = async (
  _signerAddress: `0x${string}` | undefined,
  { _walletAddress }: GetUserByWalletAddress
): Promise< bookStoreUser| null> => {
  let bookStoreUser: bookStoreUser | null = null;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedBookStoreUser = await publicClient.readContract({
        address: bookStoreAddress,
        abi: bookStoreAddressABI,
        functionName: "getUserByWalletAddress",
        args: [_signerAddress],
      }) as any;

      bookStoreUser = {
        id: Number(fetchedBookStoreUser["id"]),
        walletAddress: fetchedBookStoreUser["walletAddress"],
        username: fetchedBookStoreUser["username"],
        emailAddress: fetchedBookStoreUser["emailAddress"],
        password: fetchedBookStoreUser["password"],
        isCreatingUser: fetchedBookStoreUser["isCreatingUser"],
        isBlank: fetchedBookStoreUser["isBlank"]
      };
      
      return bookStoreUser;
    } catch (err) {
      console.info(err);
      return bookStoreUser ;
    }
  }
  return null;
};

export type GetUserByWalletAddress = {
  _walletAddress: `0x${string}`;
};
