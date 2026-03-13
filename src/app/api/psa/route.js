import { NextResponse } from "next/server";

const PSA_API = "https://api.psacard.com/publicapi/cert/GetByCertNumber";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cert = searchParams.get("cert");

    if (!cert || !/^\d+$/.test(cert.trim())) {
      return NextResponse.json(
        { error: "Valid PSA cert number required" },
        { status: 400 }
      );
    }

    const token = process.env.PSA_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "PSA API token not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${PSA_API}/${cert.trim()}`, {
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      return NextResponse.json(
        { error: "Cert number not found" },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `PSA API error: ${response.status}`, detail: errText.slice(0, 300) },
        { status: response.status }
      );
    }

    const data = await response.json();

    // The PSA API nests cert data under PSACert
    const psaCert = data.PSACert || data;

    // PSA image URLs follow a known pattern using the cert number
    // Images are hosted on PSA's CDN for cards graded after Oct 2021
    const certNum = psaCert.CertNumber || cert;
    const psaImageBase = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${certNum}`;

    // Try multiple possible image field names from the API response
    const imageFront = psaCert.ImageFrontSmall || psaCert.ImageFrontLarge || psaCert.ImageFront 
      || psaCert.imageFrontSmall || psaCert.imageFrontLarge || psaCert.imageFront
      || psaCert.FrontImageURL || psaCert.frontImageURL
      || null;

    // Build a clean response - include raw data for debugging
    const result = {
      certNumber: certNum,
      year: psaCert.Year || psaCert.year || "",
      brand: psaCert.Brand || psaCert.brand || "",
      subject: psaCert.Subject || psaCert.subject || "",
      cardNumber: psaCert.CardNumber || psaCert.cardNumber || "",
      category: psaCert.Category || psaCert.category || "",
      grade: psaCert.CardGrade || psaCert.cardGrade || psaCert.GradeDescription || "",
      labelType: psaCert.LabelType || psaCert.labelType || "",
      variety: psaCert.Variety || psaCert.variety || "",
      imageFront: imageFront,
      imageBack: psaCert.ImageBackSmall || psaCert.ImageBack || psaCert.imageBackSmall || null,
      // Constructed image URL as fallback
      imageFrontConstructed: `${psaImageBase}/small_front.jpg`,
      specNumber: psaCert.SpecNumber || psaCert.specNumber || "",
      specID: psaCert.SpecID || psaCert.specID || "",
      psaEstimate: psaCert.PSAEstimate || psaCert.psaEstimate || null,
      population: psaCert.TotalPopulation || psaCert.totalPopulation || null,
      populationHigher: psaCert.TotalPopulationWithHigher || psaCert.totalPopulationWithHigher || null,
      valid: data.IsValidRequest || false,
      // Include raw keys for debugging
      _rawKeys: Object.keys(psaCert),
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
