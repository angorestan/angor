import { Execute } from "./exec";

// git clone
export const Clone = (url: string, path: string): Promise<void> => Execute(`git clone ${url} ${path}`);

// git pull
export const Pull = (path: string): Promise<void> => Execute(`git pull -f`, { cwd: path });

export default {
	Clone,
	Pull,
};
