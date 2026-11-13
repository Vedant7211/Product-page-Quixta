import { NextResponse } from "next/server";

const product = {
  name: "Linden shelf",
  description: "A solid linden wall shelf with hidden brackets.",
  priceCents: 18000,
  fulfillment: [
    { code: "pickup", label: "Pickup", priceCents: 0 },
    { code: "delivery", label: "Delivery", priceCents: 2500 },
  ],
  extras: [
    {
      code: "assembly",
      label: "Assembly",
      priceCents: 4000,
      requires: "delivery",
    },
    {
      code: "hardware",
      label: "Hardware kit",
      priceCents: 3000,
      requires: null,
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? process.env.PRODUCT_API_MODE;

  if (mode === "error") {
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }

  if (mode === "slow") {
    await new Promise((res) => setTimeout(res, 2000));
  }

  return NextResponse.json(product);
}
