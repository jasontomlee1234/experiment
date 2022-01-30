import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injected } from "../connectors";
import useSWR from "swr";
import useMinecraftNFTContract from "../hooks/useMinecraftNFTContract";
import useEtherSWR, { EthSWRConfig } from 'ether-swr'


const NFTs = () => {
  const { account, library } = useWeb3React();
  const { data: balance } = useEtherSWR([
    '0xE3a0C3487ad6a22e0fd77125CAedCdD52236d759', // DAI contract
    'getUsersTokens', // Method
    account
  ])


  return (
    <div>
      asdf
    </div>
  )
};

export default NFTs;
