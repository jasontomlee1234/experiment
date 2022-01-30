/* eslint-disable import/no-anonymous-default-export */

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await fetch(`${process.env.HOST}/v1/server/exec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.SERVER_KEY,
        },
        body: new URLSearchParams({
          command: `eco take ${req.body.cashOutName} ${req.body.amount}`,
          time: 3,
        } as any),
      });
      res.status(200)
    } catch (e) {
      res.status(500)
    }

  }
};
