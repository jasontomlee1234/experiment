import useSWR from "swr";
import type { MinecraftNFT } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useMinecraftNFTContract from "./useMinecraftNFTContract";
import useTokenContract from "./useTokenContract";

function getUsersToken(contract: MinecraftNFT) {
  return async (_: string, address: string) => {
    const tokens = await contract.getUsersTokens();
    return tokens.map(tokenId=>tokenId.toNumber());
  };
}

export default function useUsersTokens(
  address: string,
  tokenAddress: string,
  suspense = false
) {
  const contract = useMinecraftNFTContract(tokenAddress);

  const shouldFetch =
    typeof address === "string" &&
    typeof tokenAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["UsersTokens", address, tokenAddress] : null,
    getUsersToken(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
