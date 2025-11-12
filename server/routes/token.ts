import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Ensure env vars are loaded

const router = express.Router();

interface IamTokenResponse {
  access_token: string;
  expires_in?: number;
  [key: string]: any;
}

router.post("/token", async (req, res) => {
  try {
    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.AGENT_API_KEY}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token fetch failed: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as IamTokenResponse;

    // Return both token and expiry
    res.json({ access_token: data.access_token, expires_in: data.expires_in });
  } catch (err) {
    console.error("Token fetch failed", err);
    res.status(500).json({ error: "Failed to get IAM token" });
  }
});

export default router;
