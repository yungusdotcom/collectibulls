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

    // Extract the cert data from the PSA response
    const psaCert = data.PSACert || data;

    // Build a clean response
    const result = {
      certNumber: psaCert.CertNumber || cert,
      year: psaCert.Year || "",
      brand: psaCert.Brand || "",
      subject: psaCert.Subject || "",
      cardNumber: psaCert.CardNumber || "",
      category: psaCert.Category || "",
      grade: psaCert.CardGrade || "",
      labelType: psaCert.LabelType || "",
      variety: psaCert.Variety || "",
      qualifierGrade: psaCert.QualifierGrade || "",
      // Front and back images (available for cards graded after Oct 2021)
      imageFront: psaCert.ImageFrontSmall || psaCert.ImageFront || null,
      imageBack: psaCert.ImageBackSmall || psaCert.ImageBack || null,
      // Spec number for population lookups
      specNumber: psaCert.SpecNumber || "",
      specID: psaCert.SpecID || "",
      // PSA estimated value if available
      psaEstimate: psaCert.PSAEstimate || null,
      population: psaCert.TotalPopulation || null,
      populationHigher: psaCert.TotalPopulationWithHigher || null,
      // Validity
      valid: data.IsValidRequest || false,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
