import MinecraftNFT_ABI from "../contracts/MinecraftNFT.json";
import type { MinecraftNFT } from "../contracts/types";
import useContract from "./useContract";

export default function useMinecraftNFTContract(tokenAddress?: string) {
  return useContract<MinecraftNFT>(tokenAddress, MinecraftNFT_ABI);
}
