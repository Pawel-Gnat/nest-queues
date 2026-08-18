import { createProjectContract } from "./project.contract";

export const rpcContract = {
	project: {
		createProject: createProjectContract,
	},
};
