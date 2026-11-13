import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import OrderDialog from "@/components/OrderDialog";
import type { Product } from "@/types/product";

const product: Product = {
  name: "Linden shelf",
  description: "A solid linden wall shelf with hidden brackets.",
  priceCents: 18000,
  fulfillment: [
    { code: "pickup", label: "Pickup", priceCents: 0 },
    { code: "delivery", label: "Delivery", priceCents: 2500 },
  ],
  extras: [
    { code: "assembly", label: "Assembly", priceCents: 4000, requires: "delivery" },
    { code: "hardware", label: "Hardware kit", priceCents: 3000, requires: null },
  ],
};

function renderDialog() {
  const onClose = vi.fn();
  render(<OrderDialog product={product} onClose={onClose} />);
  return { onClose };
}

it("shows $275 when Delivery, Assembly, and Hardware kit are all selected", async () => {
  const user = userEvent.setup();
  renderDialog();

  await user.click(screen.getByRole("radio", { name: /delivery/i }));
  await user.click(screen.getByRole("checkbox", { name: /assembly/i }));
  await user.click(screen.getByRole("checkbox", { name: /hardware kit/i }));

  expect(screen.getByText("$275")).toBeInTheDocument();
});

it("clears Assembly when switching to Pickup, and confirmation omits Assembly", async () => {
  const user = userEvent.setup();
  renderDialog();

  await user.click(screen.getByRole("radio", { name: /delivery/i }));
  await user.click(screen.getByRole("checkbox", { name: /assembly/i }));

  await user.click(screen.getByRole("radio", { name: /pickup/i }));

  const assemblyCheckbox = screen.getByRole("checkbox", { name: /assembly/i });
  expect(assemblyCheckbox).not.toBeChecked();
  expect(assemblyCheckbox).toBeDisabled();

  expect(screen.getByText("$180")).toBeInTheDocument();

  await user.click(screen.getByRole("checkbox", { name: /hardware kit/i }));
  await user.click(screen.getByRole("button", { name: /add to order/i }));

  const heading = screen.getByText(/added to your order/i);
  expect(heading).toBeInTheDocument();

  expect(screen.queryByText(/^assembly$/i)).not.toBeInTheDocument();
});

it("shows validation error when submitting without selecting fulfillment", async () => {
  const user = userEvent.setup();
  renderDialog();

  await user.click(screen.getByRole("button", { name: /add to order/i }));

  expect(
    await screen.findByText(/choose pickup or delivery/i),
  ).toBeInTheDocument();

  expect(screen.queryByText(/added to your order/i)).not.toBeInTheDocument();
});

