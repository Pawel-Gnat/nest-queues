import { z } from "zod";

export const taskSchema = z.object({
	id: z.string(),
	projectId: z.string(),
	title: z.string(),
});
export type Task = z.infer<typeof taskSchema>;
