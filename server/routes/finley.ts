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
  const { message, history } = req.body;

  try {
    const prompt =
      (history || [])
        .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n') + `\nUser: ${message}\nAssistant:`;

    const token = await getIamToken(process.env.AGENT_API_KEY || '');

    const ibmRes = await fetch('https://us-south.ml.cloud.ibm.com/v2/generation/text', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ml.project_id': process.env.VITE_IBM_PROJECT_ID || ''
      },
      body: JSON.stringify({
        model_id: process.env.IBM_MODEL_ID,
        input: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.4,
          top_p: 0.9,
          stop_sequences: ['\nUser:']
        }
      })
    });

    // Tell TypeScript exactly what to expect
    const data = (await ibmRes.json()) as IbmResponse;

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
