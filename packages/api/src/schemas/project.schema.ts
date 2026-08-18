import { z } from "zod";

import { apiPayload } from "./common.schema";
import { taskSchema } from "./task.schema";

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	tasks: z.array(taskSchema),
	createdAt: z.iso.datetime(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectPayloadSchema = z.object({
	name: z.string(),
	tasks: z.array(z.object({ title: z.string() })),
});
export type ProjectPayload = z.infer<typeof projectPayloadSchema>;

export const projectResponseSchema = apiPayload(projectSchema);
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
