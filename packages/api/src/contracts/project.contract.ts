import { oc } from "@orpc/contract";

import {
	projectPayloadSchema,
	projectResponseSchema,
} from "../schemas/project.schema";

export const createProjectContract = oc
	.route({ method: "POST", path: "/project" })
	.input(projectPayloadSchema)
	.output(projectResponseSchema);
