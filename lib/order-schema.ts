import { z } from "zod";

export const orderSchema = z
  .object({
    fulfillment: z.union([
      z.literal("pickup"),
      z.literal("delivery"),
      z.literal(""),
    ]),
    assembly: z.boolean(),
    hardware: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.fulfillment) {
      ctx.addIssue({
        code: "custom",
        path: ["fulfillment"],
        message: "Choose pickup or delivery",
      });
    }
    if (data.assembly && data.fulfillment !== "delivery") {
      ctx.addIssue({
        code: "custom",
        path: ["assembly"],
        message: "Assembly is only available with Delivery",
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderSchema>;
