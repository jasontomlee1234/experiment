import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import NFTs from "../components/NFTs";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
import { MinecraftNFT } from "../contracts/types";
import useContract from "../hooks/useContract";
import useEagerConnect from "../hooks/useEagerConnect";
import MinecraftNFT_ABI from "../contracts/MinecraftNFT.json";
import { Contract } from "@ethersproject/contracts";
import { useEffect, useState } from "react";
import useMinecraftNFTContract from "../hooks/useMinecraftNFTContract";
import useUsersTokens from "../hooks/useUsersTokens";
import useEtherSWR, { EthSWRConfig } from "ether-swr";
import useSWR from "swr";
import useCoinContract from "../hooks/useCoinContract";
import {
  formatUnits,
  parseUnits,
  formatEther,
  parseEther,
  commify,
} from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

function Home() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();
  const nft = useMinecraftNFTContract(
    "0xE8B1616E2Fac8ce118efCB9b26776a04B6546a9a"
  );
  const coin = useCoinContract("0x0047a00aD14218402193e7D7FFeCecccf4b3cb2A");

  const [nftBalance, setNftBalance] = useState([]);
  const [coinBalance, setCoinBalance] = useState("0");
  const [now, setNow] = useState();
  const [name, setName] = useState("");
  const [topupAmount, setTopupAmount] = useState();
  const [topupName, setTopupName] = useState("");
  const [cashOutName, setCashOutName] = useState("");
  const [tokenId, setTokenId] = useState();

  function nameChangeHandler(e) {
    setName(e.target.value);
  }

  function idChangeHandler(e) {
    setTokenId(e.target.value);
  }

  function topupAmountChangeHandler(e) {
    setTopupAmount(e.target.value);
  }

  function topupNameChangeHandler(e) {
    setTopupName(e.target.value);
  }

  function cashOutNameChangeHandler(e) {
    setCashOutName(e.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      const b = await nft.getUsersTokens(account as any);
      console.log(b);
      setNftBalance(b);
      const cb = await coin.balanceOf(account);
      const bn = BigNumber.from(cb);
      setCoinBalance(formatEther(bn));
    }
    if (nft) {
      fetchData();
    }
  }, [account, nft, now]);

  console.log(chainId);
  const isConnected = typeof account === "string" && !!library;
  console.log(account);

  function mint() {
    nft
      .mint()
      .then((tx) => {
        return tx.wait();
      })
      .then((re) => {
        setNow(new Date() as any);
      });
  }

  function set() {
    nft
      .setUsername(tokenId, name)
      .then((tx) => {
        return tx.wait();
      })
      .then((re) => {
        setNow(new Date() as any);
      });
  }

  function topup() {
    coin
      .topUp(parseEther(topupAmount), topupName)
      .then((tx) => {
        return tx.wait();
      })
      .then((re) => {
        setNow(new Date() as any);
      });
  }

  async function cashOut() {
    console.log(process.env.HOST);
    const response = await fetch(`${process.env.HOST}/v1/server/exec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: process.env.SERVER_KEY,
      },
      body: new URLSearchParams({
        command: `balance ${cashOutName}`,
        time: 3,
      } as any),
    });
    const text = await response.text();
    const available = text.split("$")[1];
    if (!available) {
      console.error("user not found");
      return;
    }

    const data = {
      username: cashOutName,
      amount: available,
    };
    console.log(data);
    const res = await fetch(`/api/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const { v, r, s } = await res.json();
    console.log({ v, r, s });
    coin
      .cashOut(parseEther(available), cashOutName, v, r, s)
      .then((tx) => {
        return tx.wait();
      })
      .then((re) => {
        setNow(new Date() as any);
      });
  }
  return (
    <div>
      {/* <Head>
        <title>next-web3-boilerplate {}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <header>
        <nav>
          <Link href="/">
            <a>next-web3-boilerplate</a>
          </Link>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        {/* <h1>
          Welcome to{" "}
          <a href="https://github.com/mirshko/next-web3-boilerplate">
            next-web3-boilerplate
          </a>
        </h1> */}

        {isConnected && (
          <div>
            <section>
              {/* <ETHBalance />

            <TokenBalance tokenAddress={DAI_TOKEN_ADDRESS} symbol="DAI" /> */}
              <button
                onClick={() => {
                  console.log(nft);
                  mint();
                }}
              >
                Mint
              </button>
            </section>
            <br />
            <section>
              your NFT: {nftBalance.map((x) => x.toString()).join(",")}
            </section>
            <br />
            <section>
              <div>set whitelist</div>
              <div>
                tokenId:
                <input
                  type={"number"}
                  value={tokenId}
                  onChange={idChangeHandler}
                ></input>
              </div>
              <div>
                username:
                <input
                  type={"text"}
                  value={name}
                  onChange={nameChangeHandler}
                ></input>
              </div>
              <div>
                <button onClick={set}>set</button>
              </div>
            </section>
            <br />
            <section>
              <div>coin balance</div>
              <div>{coinBalance}</div>
              <div>
                top-up amount:
                <input
                  type={"number"}
                  value={topupAmount}
                  onChange={topupAmountChangeHandler}
                ></input>
              </div>
              <div>
                top-up name:
                <input
                  type={"text"}
                  value={topupName}
                  onChange={topupNameChangeHandler}
                ></input>
              </div>
              <div>
                <button onClick={topup}>top up</button>
              </div>
            </section>
            <br />
            <section>
              <div>cash out</div>
              <div>
                username:{" "}
                <input
                  type={"text"}
                  value={cashOutName}
                  onChange={cashOutNameChangeHandler}
                ></input>
              </div>
              <div>
                <button onClick={cashOut}>cash out</button>
              </div>
            </section>
          </div>
        )}
        {/* <NFTs /> */}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
