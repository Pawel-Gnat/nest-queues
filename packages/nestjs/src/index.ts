export {
	CLIENTS,
	type ClientName,
	NOTIFICATION_CLIENT,
	ORDER_CLIENT,
	PAYMENT_CLIENT,
} from "./clients";
export { createRmqMicroservice } from "./create-rmq-microservice";
export {
	type RmqClientConfig,
	registerRmqClients,
} from "./register-rmq-clients";
