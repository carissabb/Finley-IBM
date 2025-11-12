import express from "express";
import fetch from "node-fetch";

const router = express.Router();

interface IamTokenResponse {
  access_token: string;
  expires_in?: number;
  [key: string]: any;
}

router.post("/", async (req, res) => {
  try {
    const apiKey = process.env.VITE_AGENT_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing VITE_AGENT_API_KEY in env");
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(apiKey)}`
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ IAM token fetch failed: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ error: errorText });
    }

    const data = (await response.json()) as IamTokenResponse;
    res.json({ access_token: data.access_token });
  } catch (err) {
    console.error("❌ IAM token exception:", err);
    res.status(500).json({ error: "Failed to get IAM token" });
  }
});

export default router;
