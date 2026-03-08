import { NextResponse } from "next/server";
import { getEbayToken } from "@/lib/ebayAuth";

const BROWSE_API = "https://api.ebay.com/buy/browse/v1/item_summary/search";

// Sanitize search input — strip HTML/script tags, limit length
function sanitizeQuery(q) {
  if (!q || typeof q !== "string") return "";
  return q
    .replace(/[<>"'&;]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

// Rate limiting — simple in-memory tracker
const rateLimiter = new Map();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimiter.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_WINDOW;
  }

  record.count++;
  rateLimiter.set(ip, record);

  // Clean up old entries periodically
  if (rateLimiter.size > 1000) {
    for (const [key, val] of rateLimiter) {
      if (now > val.resetAt) rateLimiter.delete(key);
    }
  }

  return record.count <= RATE_LIMIT;
}

export async function GET(request) {
  try {
    // Rate limit check
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q");
    const query = sanitizeQuery(rawQuery);

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      50
    );
    const sort = searchParams.get("sort") || "price";
    const category = searchParams.get("category") || "";
    const catKey = (category || "").toLowerCase();

    // Trading card category IDs
    const categoryMap = {
      sports: "2536",
      pokemon: "183454",
      mtg: "183454",
      yugioh: "183454",
      all_cards: "",
      all: "",
    };
    const catId = categoryMap[catKey] || "";

    // Build eBay API URL
    // Append "card" to query when no specific category to keep results relevant
    const searchQuery = !catId ? `${query} card` : query;
    const params = new URLSearchParams({
      q: searchQuery,
      limit: limit.toString(),
    });

    // Only add sort if not "relevance" (eBay defaults to relevance when omitted)
    if (sort && sort !== "relevance") {
      params.set("sort", sort);
    }

    if (catId) {
      params.set("category_ids", catId);
    }

    // Filter for Buy It Now items
    params.set(
      "filter",
      "buyingOptions:{FIXED_PRICE}"
    );

    const token = await getEbayToken();

    const response = await fetch(`${BROWSE_API}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("eBay API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch from eBay", status: response.status, detail: errorText.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Transform response — only return what the frontend needs
    const items = (data.itemSummaries || []).map((item) => ({
      id: item.itemId,
      title: item.title,
      price: item.price
        ? {
            value: parseFloat(item.price.value),
            currency: item.price.currency,
          }
        : null,
      condition: item.condition || "Unknown",
      imageUrl: item.image?.imageUrl || null,
      itemUrl: item.itemWebUrl || null,
      seller: item.seller
        ? {
            username: item.seller.username,
            feedbackScore: item.seller.feedbackScore,
            feedbackPercentage: item.seller.feedbackPercentage,
          }
        : null,
      shippingCost: item.shippingOptions?.[0]?.shippingCost
        ? parseFloat(item.shippingOptions[0].shippingCost.value)
        : null,
      buyingOptions: item.buyingOptions || [],
      listingDate: item.itemCreationDate || null,
    }));

    // Calculate price stats
    const prices = items
      .map((i) => i.price?.value)
      .filter((p) => p != null && p > 0);
    const stats = {
      count: prices.length,
      avg: prices.length
        ? Math.round((prices.reduce((s, p) => s + p, 0) / prices.length) * 100) / 100
        : 0,
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
      median: prices.length
        ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
        : 0,
    };

    return NextResponse.json({
      query,
      total: data.total || 0,
      items,
      priceStats: stats,
    });
  } catch (error) {
    console.error("eBay search error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
