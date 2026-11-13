"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Product } from "@/types/product";
import { orderSchema, type OrderFormValues } from "@/lib/order-schema";
import { calculateTotal } from "@/lib/calculate-total";
import { formatCurrency } from "@/lib/format-currency";

interface OrderDialogProps {
  product: Product;
  onClose: () => void;
}

export default function OrderDialog({ product, onClose }: OrderDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fulfillment: "",
      assembly: false,
      hardware: false,
    },
  });

  const values = watch();

  useEffect(() => {
    if (values.fulfillment !== "delivery") {
      setValue("assembly", false);
    }
  }, [values.fulfillment, setValue]);

  const total = calculateTotal(product, values);

  const fulfillment = product.fulfillment.find(
    (option) => option.code === values.fulfillment,
  );

  const assembly = product.extras.find((option) => option.code === "assembly");

  const hardware = product.extras.find((option) => option.code === "hardware");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const firstControl = dialog.querySelector<HTMLElement>("button, input");

    firstControl?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab" && dialog) {
        const controls = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            "button:not(:disabled), input:not(:disabled)",
          ),
        );

        if (!controls.length) return;

        const first = controls[0];
        const last = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function onSubmit(_data: OrderFormValues) {
    setSubmitted(true);
  }

  function handleBack() {
    reset();
    setSubmitted(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        className="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white text-gray-900 md:max-w-[480px] md:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pb-1 pt-3 md:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="order-title" className="text-xl font-bold text-gray-900">
              {submitted ? "Added to your order" : "Add to order"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="">{fulfillment?.label}</p>

                {values.assembly && assembly && <p>{assembly.label}</p>}

                {values.hardware && hardware && <p>{hardware.label}</p>}

                <div className="border-t pt-3 font-bold">
                  Total: {formatCurrency(total)}
                </div>
              </div>

              <button
                onClick={handleBack}
                className="min-h-11 w-full rounded-md bg-[#1F4D3A] px-5 py-3 font-medium text-white transition-colors hover:bg-[#173b2c]"
              >
                Back to product
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <fieldset className="space-y-2">
                <legend className="mb-2 font-semibold text-gray-900">Fulfillment</legend>

                {product.fulfillment.map((option) => (
                  <label
                    key={option.code}
                    className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                      values.fulfillment === option.code
                        ? "border-[#1F4D3A] bg-[#1F4D3A]/5 font-medium"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={option.code}
                        {...register("fulfillment")}
                        className="accent-[#1F4D3A]"
                      />
                      {option.label}
                    </span>

                    <span className="text-sm text-gray-600">
                      {formatCurrency(option.priceCents)}
                    </span>
                  </label>
                ))}

                {errors.fulfillment && (
                  <p className="text-sm text-[#B42318]" role="alert">
                    {errors.fulfillment.message}
                  </p>
                )}
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="mb-2 font-semibold text-gray-900">Extras</legend>

                {assembly && (
                  <div>
                    <label
                      className={`flex min-h-11 items-center justify-between rounded-lg border p-3 transition-colors ${
                        values.fulfillment !== "delivery"
                          ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
                          : values.assembly
                            ? "cursor-pointer border-[#1F4D3A] bg-[#1F4D3A]/5 font-medium"
                            : "cursor-pointer border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          {...register("assembly")}
                          disabled={values.fulfillment !== "delivery"}
                          className="accent-[#1F4D3A]"
                        />
                        <span>
                          {assembly.label}
                          {values.fulfillment !== "delivery" && (
                            <span className="ml-1 text-xs text-gray-400">
                              (delivery only)
                            </span>
                          )}
                        </span>
                      </span>

                      <span className="text-sm text-gray-600">
                        {formatCurrency(assembly.priceCents)}
                      </span>
                    </label>

                    {errors.assembly && (
                      <p className="mt-1 text-sm text-[#B42318]" role="alert">
                        {errors.assembly.message}
                      </p>
                    )}
                  </div>
                )}

                {hardware && (
                  <label
                    className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                      values.hardware
                        ? "border-[#1F4D3A] bg-[#1F4D3A]/5 font-medium"
                        : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        {...register("hardware")}
                        className="accent-[#1F4D3A]"
                      />
                      {hardware.label}
                    </span>

                    <span className="text-sm text-gray-600">
                      {formatCurrency(hardware.priceCents)}
                    </span>
                  </label>
                )}
              </fieldset>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="min-h-11 w-full rounded-md bg-[#1F4D3A] px-5 py-3 font-medium text-white transition-colors hover:bg-[#173b2c]"
              >
                Add to order
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
