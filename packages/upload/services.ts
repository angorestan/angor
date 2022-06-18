// import packages
import fs from "fs";
import path from "path";
// interface
import { IUpload } from "./interface";
// lib
import { Logger } from "@lib/logger";
import Redis from "@lib/redis";

// add upload
export const AddUpload = async (upload: IUpload) => {
	await Redis.set(`upload:${upload.app}:${upload.id}`, JSON.stringify(upload));
};

// delete upload
export const DeleteUpload = async (app: string, id: string) => {
	await Redis.del(`upload:${app}:${id}`);
};

// get upload
export const GetUpload = async (app: string, id: string): Promise<IUpload | undefined> => {
	const upload = await Redis.get(`upload:${app}:${id}`);
	return upload ? JSON.parse(upload) : undefined;
};

// get all uploads by app
export const GetUploads = async (app: string): Promise<IUpload[]> => {
	const keys = await Redis.keys(`upload:${app}:*`);
	const result = keys.map(async (key: string) => {
		return JSON.parse((await Redis.get(key))!) as IUpload;
	});
	return Promise.all(result);
};

// Prune uploads but not one that in use
export const PruneUploads = async (app: string, onuse: string): Promise<IUpload[]> => {
	try {
		Logger.info(`Pruning uploads for app ${app}`);
		const uploads = await GetUploads(app);
		let uploadsToDelete: IUpload[] = [];
		for (const upload of uploads) {
			if (upload.filename != onuse) {
				uploadsToDelete.push(upload);
				// delete upload from redis
				await DeleteUpload(app, upload.id);
				// file path
				const file = path.join(__dirname, "../../", upload.path);
				// delete upload from filesystem
				if (fs.existsSync(file)) {
					fs.unlinkSync(file);
					Logger.info(`Deleted upload file: ${file}`);
				}
			}
		}
		Logger.info(`Pruned ${uploadsToDelete.length} uploads`);
		return uploadsToDelete;
	} catch (error) {
		return Promise.reject(error);
	}
};

// Delete a upload
export const PruneUpload = async (upload: IUpload): Promise<void> => {
	try {
		Logger.info(`Deleting upload app ${upload.app} file ${upload.filename}`);
		// delete upload
		await DeleteUpload(upload.app, upload.id);
		// file path
		const file = path.join(__dirname, "../../", upload.path);
		// delete upload from filesystem if exists
		if (fs.existsSync(file)) {
			fs.unlinkSync(file);
			Logger.info(`Deleted upload file: ${file}`);
		}
	} catch (error) {
		return Promise.reject(error);
	}
};

export default {
	AddUpload,
	DeleteUpload,
	GetUpload,
	GetUploads,
	PruneUploads,
	PruneUpload,
};
