import { z } from "zod";

import { apiPayload } from "./common.schema";

export const orderStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"cancelled",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderSchema = z.object({
	id: z.string(),
	cartId: z.string(),
	userId: z.string(),
	status: orderStatusSchema,
	createdAt: z.iso.datetime(),
});
export type Order = z.infer<typeof orderSchema>;

export const orderPayloadSchema = orderSchema.pick({
	cartId: true,
});
export type OrderPayload = z.infer<typeof orderPayloadSchema>;

export const orderResponseSchema = apiPayload(orderSchema);
export type OrderResponse = z.infer<typeof orderResponseSchema>;
