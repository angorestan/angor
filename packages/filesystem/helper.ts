import fs from "fs";
import path from "path";
// interfaces
import { IFile } from "./interface";

export const walk = (directory: string): IFile[] => {
	const files = fs.readdirSync(directory);
	let output: IFile[] = [];
	for (let file of files) {
		const _path = path.join(directory, file);
		const stat = fs.statSync(_path);

		output.push({
			name: file,
			size: stat.size,
			path: "/" + _path.replace(/\\/g, "/"),
			mode: "0" + (stat.mode & parseInt("777", 8)).toString(8),
			directory: stat.isDirectory(),
			createdAt: stat.birthtime,
			updatedAt: stat.mtime,
		});
	}
	return output;
};
