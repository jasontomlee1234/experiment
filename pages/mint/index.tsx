import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { MinecraftNFT } from "../../contracts/types";
import useEagerConnect from "../../hooks/useEagerConnect";
import useMinecraftNFTContract from "../../hooks/useMinecraftNFTContract";
import useTokenContract from "../../hooks/useTokenContract";

function mint(contract: MinecraftNFT) {
  contract.mint();
}

function changeNetwork() {
  window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x89",
        rpcUrls: ["https://rpc-mainnet.matic.network/"],
        chainName: "Matic Mainnet",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    ],
  });
}

function MintPage() {
  const { account, library, chainId } = useWeb3React();
  const nft = useMinecraftNFTContract(process.env.MINECRAFT_NFT_ADDRESS);
  const triedToEagerConnect = useEagerConnect();

  console.log(chainId);
  return (
    <div>
      <button
        onClick={() => {
          if (chainId == 4002) {
            mint(nft);
          } else {
            changeNetwork()
          }
        }}
      >
        {chainId == 4002 ? "mint" : "switch to fantom"}
      </button>
    </div>
  );
}

export default MintPage;
