/* eslint-disable import/no-anonymous-default-export */

import { NextApiRequest, NextApiResponse } from "next";
import { Wallet } from "@ethersproject/wallet";
import { splitSignature, arrayify } from "@ethersproject/bytes";
import { AbiCoder } from "@ethersproject/abi"
import { keccak256 } from "@ethersproject/keccak256"
const { ethers } = require("ethers");
import {
  formatUnits,
  parseUnits,
  formatEther,
  parseEther,
  commify,
} from "@ethersproject/units";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const abiCoder = new AbiCoder()
  console.log(req.body)
  if (req.method === "POST") {
    const signer = new Wallet(process.env.PRIVATE_KEY)
    const encoded = ethers.utils.solidityKeccak256(["uint", "string"], [parseEther(req.body.amount), req.body.username]);
    console.log(encoded)
    const signature = await signer.signMessage(arrayify(encoded));
    const { r, s, v } = splitSignature(signature)

    res.send({
      v,r,s
    })
  }
  return
};
