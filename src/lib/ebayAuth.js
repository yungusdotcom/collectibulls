// Server-side only — never import this in client components
const TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const SCOPE = "https://api.ebay.com/oauth/api_scope";

let cachedToken = null;
let tokenExpiry = 0;

export async function getEbayToken() {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("eBay credentials not configured");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(SCOPE)}`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`eBay OAuth failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}
