import { z } from "zod";

export const paymentResultSchema = z.object({
	ok: z.boolean(),
	orderId: z.string(),
});
export type PaymentResult = z.infer<typeof paymentResultSchema>;
