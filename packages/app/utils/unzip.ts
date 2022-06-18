// import packages
import fs from "fs";
import unzip from "unzipper";
// utils
import { Logger } from "@lib/logger";

// unzip file to destination
export const UnZIP = (file: string, destination: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		fs.createReadStream(file)
			.pipe(unzip.Extract({ path: destination }))
			.on("close", () => {
				Logger.info(`Unzipped ${file} to ${destination}`);
				resolve(true);
			})
			.on("error", (err) => reject(err));
	});
};
