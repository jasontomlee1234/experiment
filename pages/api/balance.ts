/* eslint-disable import/no-anonymous-default-export */

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query)
  console.log("asdfsadf")
  if (req.method === "GET") {
    const response = await fetch(`${process.env.HOST}/v1/server/exec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: process.env.SERVER_KEY,
      },
      body: new URLSearchParams({
        command: `balance ${req.query.cashOutName}`,
        time: 3,
      } as any),
    });

    const text = await response.text();
    const available = text.split("$")[1];

    if (!available) {
      console.error("user not found");
      res.status(404).json({ message: "user not found" })
    }

    res.send({
      available
    })
  }
};
