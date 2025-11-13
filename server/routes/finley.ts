import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

let iamToken = '';
let iamExpiry = 0;

// -------------------- Types --------------------

// IBM IAM token response
interface IamTokenResponse {
  access_token: string;
  expires_in: number;
}

// IBM model inference response
interface IbmResponse {
  results?: { generated_text?: string }[];
  generated_text?: string;
  output_text?: string;
}

// -------------------- IAM Token --------------------
async function getIamToken(apiKey: string): Promise<string> {
  const now = Date.now();
  if (iamToken && now < iamExpiry - 60_000) return iamToken;

  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(apiKey)}`
  });

  if (!res.ok) {
    throw new Error(`IAM token error: ${res.status} ${await res.text()}`);
  }

  // Explicitly cast the JSON to your known type
  const data = (await res.json()) as IamTokenResponse;

  iamToken = data.access_token;
  iamExpiry = now + (data.expires_in ?? 3600) * 1000;

  return iamToken;
}

// -------------------- Route --------------------
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  try {
    const token = await getIamToken(process.env.AGENT_API_KEY || '');

    // Combine history with new message
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const ibmRes = await fetch(
      'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/568dccee-ba2c-4bf7-b774-2dcb49ea7e9c/ai_service?version=2021-05-01',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        messages: [
            { role: 'user', content: message }
        ]
        })
      }
    );

    const data = (await ibmRes.json()) as IbmResponse;
    console.log('🔍 IBM raw response:', data);

    const reply =
      data?.results?.[0]?.generated_text ??
      data?.generated_text ??
      data?.output_text ??
      'Sorry, no response.';

    res.json({ reply });
  } catch (err) {
    console.error('Finley backend error:', err);
    res.status(500).json({ error: 'Failed to fetch response from IBM model.' });
  }
});

export default router;