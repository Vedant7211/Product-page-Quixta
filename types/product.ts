export type FulfillmentCode = "pickup" | "delivery";

export type ExtraCode = "assembly" | "hardware";

export interface FulfillmentOption {
  code: FulfillmentCode;
  label: string;
  priceCents: number;
}

export interface ExtraOption {
  code: ExtraCode;
  label: string;
  priceCents: number;
  requires: FulfillmentCode | null;
}

export interface Product {
  name: string;
  description: string;
  priceCents: number;
  fulfillment: FulfillmentOption[];
  extras: ExtraOption[];
}
