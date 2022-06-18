// import packages
import fs from "fs";
// utils
import { UnZIP } from "./utils/unzip";
import { Execute } from "./utils/exec";
import Git from "./utils/git";
// lib
import { Logger } from "@lib/logger";
// interface
import { IApp } from "./interface";

// get upload config from env
const { UPLOAD_DEST } = process.env;

export const Startup = async (app: IApp) => {
	try {
		Logger.info(`Startup app ${app.name} with source ${app.source} and ${typeof app.startup === "string" ? 1 : app.startup?.length} startup commands at ${app.path}`);
		if (app.source.startsWith("upload:")) {
			const source = app.source.replace("upload:", (UPLOAD_DEST as string) + "/");

			if (fs.existsSync(app.path)) {
				// clear all file in source directory wwith fs
				for (const item of fs.readdirSync(app.path)) {
					// if item is directory
					if (fs.lstatSync(app.path + item).isDirectory()) {
						// delete directory
						fs.rmSync(app.path + item, { recursive: true });
					} else {
						// delete file
						fs.unlinkSync(app.path + item);
					}
				}
			}

			await ExtractAppZIPSource(source, app.path);
		}
		if (app.source.startsWith("git:")) {
			// if directory is not exist clone else pull
			if (!fs.existsSync(app.path)) {
				await Git.Clone(app.source.replace("git:", ""), app.path);
			} else {
				await Git.Pull(app.path);
			}
		}
		if (app.startup && app.startup.length != 0) {
			// execute app script if type is string
			if (typeof app.startup == "string") {
				await RunScript(app.startup, app.path);
			}
			// execute app script if type is array
			if (Array.isArray(app.startup)) {
				for (let i = 0; i < app.startup.length; i++) {
					await RunScript(app.startup[i], app.path);
				}
			}
		}
		return Promise.resolve();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const Destroy = (app: IApp) => {
	try {
		Logger.info(`Destroy app ${app.name} with ${typeof app.destroy === "string" ? 1 : app.destroy?.length} destroy commands at ${app.path}`);
		if (app.destroy && app.destroy.length != 0) {
			// execute app destroy script if type is string
			if (typeof app.destroy == "string") {
				return RunScript(app.destroy, app.path);
			}
			// execute app destroy script if type is array
			if (Array.isArray(app.destroy)) {
				for (let i = 0; i < app.destroy.length; i++) {
					RunScript(app.destroy[i], app.path);
				}
			}
		}
		if (app.path && fs.existsSync(app.path)) {
			// remove app folder
			fs.rmSync(app.path, { recursive: true });
		}

		return Promise.resolve();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const ExtractAppZIPSource = (source: string, destination: string) => UnZIP(source, destination);

export const RunScript = (script: string, path: string): Promise<void> => Execute(script, { cwd: path });
