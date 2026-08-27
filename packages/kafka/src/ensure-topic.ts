import { createKafka } from "./client";
import { TOPICS } from "./constants";
import { ensureTopic } from "./topics";

const kafka = createKafka("queues-lab-ensure-topic");
const result = await ensureTopic(kafka);

console.log(
	JSON.stringify(
		{
			topic: TOPICS.chatMessages,
			partitions: 3,
			...result,
		},
		null,
		2,
	),
);
