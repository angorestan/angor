// import packages
import { exec } from "child_process";
// utils
import { Logger } from "@lib/logger";

export const Execute = (command: string, options: { cwd?: string } = {}): Promise<void> =>
	new Promise((resolve, reject) => {
		exec(command, options, (err) => {
			Logger.info(`Executed \`${command}\``);
			if (err) {
				Logger.error(err.message);
			}
			resolve();
		});
	});
