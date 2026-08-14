import { oc } from "@orpc/contract";

import {
	orderPayloadSchema,
	orderResponseSchema,
} from "../schemas/order.schema";

export const createOrderContract = oc
	.route({ method: "POST", path: "/order" })
	.input(orderPayloadSchema)
	.output(orderResponseSchema);
