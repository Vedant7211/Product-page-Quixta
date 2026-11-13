import type { Product } from "@/types/product";
import type { OrderFormValues } from "./order-schema";

export function calculateTotal(
  product: Product,
  values: OrderFormValues,
): number {
  let total = product.priceCents;

  const selectedFulfillment = product.fulfillment.find(
    (option) => option.code === values.fulfillment,
  );

  if (selectedFulfillment) {
    total += selectedFulfillment.priceCents;
  }

  if (values.assembly) {
    const assembly = product.extras.find((extra) => extra.code === "assembly");

    if (assembly) total += assembly.priceCents;
  }

  if (values.hardware) {
    const hardware = product.extras.find((extra) => extra.code === "hardware");

    if (hardware) total += hardware.priceCents;
  }

  return total;
}
