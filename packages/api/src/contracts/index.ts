import { createOrderContract } from "./order.contract";

export const rpcContract = {
	order: {
		createOrder: createOrderContract,
	},
};
