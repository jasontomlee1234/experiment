import Coin_ABI from "../contracts/Coin.json";
import type { MinecraftNFT } from "../contracts/types";
import useContract from "./useContract";

export default function useCoinContract(tokenAddress?: string) {
  return useContract(tokenAddress, Coin_ABI);
}
