import { NextResponse } from "next/server";

// eBay Marketplace Account Deletion/Closure Notification endpoint
// https://developer.ebay.com/marketplace-account-deletion

// eBay sends a challenge code during verification — we must respond with a hash
// eBay also sends notifications when users request account deletion

export async function GET(request) {
  // eBay verification challenge — they send a challenge_code as a query param
  const { searchParams } = new URL(request.url);
  const challengeCode = searchParams.get("challenge_code");

  if (challengeCode) {
    // eBay expects us to hash the challenge with our verification token and endpoint
    const crypto = await import("crypto");
    const verificationToken = process.env.EBAY_VERIFICATION_TOKEN || "";
    const endpoint = process.env.EBAY_NOTIFICATION_ENDPOINT || "";

    const hash = crypto
      .createHash("sha256")
      .update(challengeCode)
      .update(verificationToken)
      .update(endpoint)
      .digest("hex");

    return NextResponse.json(
      { challengeResponse: hash },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return NextResponse.json({ status: "ok" }, { status: 200 });
}

export async function POST(request) {
  // eBay sends account deletion notifications here
  // Since we don't store any eBay user data, we just acknowledge receipt
  try {
    const body = await request.json();
    console.log("eBay account deletion notification received:", JSON.stringify(body));

    // We don't store eBay user data, so nothing to delete
    // Just acknowledge we received it
    return NextResponse.json({ status: "acknowledged" }, { status: 200 });
  } catch {
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}
