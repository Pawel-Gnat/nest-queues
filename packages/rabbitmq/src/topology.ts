import { assertDurableQueue, dlqFor } from "./dead-letter";
import { QUEUES } from "./queues";
import { workQueueArguments } from "./retry";
import { bindProjectsTopic } from "./topic";

export async function ensureBrokerQueues() {
	for (const queue of Object.values(QUEUES)) {
		await assertDurableQueue(queue, { arguments: workQueueArguments(queue) });
		await assertDurableQueue(dlqFor(queue));
	}

	await bindProjectsTopic();
}
