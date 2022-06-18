// import packages
import fs from "fs";
import path from "path";
// Request and Response are from express.
import { Request, Response } from "express";
// services
import UploadService from "./services";
import AppService from "@packages/app/services";
// interface
import { IUpload } from "./interface";
// utils
import { Logger } from "@lib/logger";

export const AddUpload = async (req: Request, res: Response): Promise<void> => {
	try {
		const file = req.file;
		const { app } = req.params;

		if (file) {
			const date = new Date();
			const upload: IUpload = {
				id: date.getTime().toString(),
				app: app,
				uploadedAt: date,
				originalname: file.originalname,
				encoding: (file as any).encoding,
				mimetype: file.mimetype,
				destination: file.destination,
				filename: file.filename,
				path: file.path,
				size: file.size,
			};

			await UploadService.AddUpload(upload);

			res.json({
				status: true,
				code: 200,
				message: "File uploaded",
				data: upload,
			});
		} else {
			res.status(400).json({
				status: false,
				code: 400,
				message: "Failed to upload file",
			});
		}
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// get list of uploads of app
export const GetUploads = async (req: Request, res: Response): Promise<void> => {
	try {
		const { app } = req.params;
		const uploads = await UploadService.GetUploads(app);
		res.json({
			status: true,
			code: 200,
			message: "Uploads retrieved",
			count: uploads.length,
			data: uploads,
		});
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// get upload by app and id
export const GetUpload = async (req: Request, res: Response): Promise<void> => {
	try {
		const { app, id } = req.params;
		const upload = await UploadService.GetUpload(app, id);
		if (upload) {
			res.json({
				status: true,
				code: 200,
				message: "Upload retrieved",
				data: upload,
			});
		} else {
			res.status(404).json({
				status: false,
				code: 404,
				message: "Upload not found",
			});
		}
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// delete upload by app and id
export const DeleteUpload = async (req: Request, res: Response): Promise<void> => {
	try {
		const { app, id } = req.params;
		// get path of upload
		const upload = await UploadService.GetUpload(app, id);
		// if upload exists
		if (upload) {
			// delete upload
			await UploadService.DeleteUpload(app, id);
			// delete upload from filesystem if exists
			await UploadService.PruneUpload(upload);
			res.json({
				status: true,
				code: 200,
				message: "Upload deleted",
			});
		} else {
			res.status(404).json({
				status: false,
				code: 404,
				message: "Upload not found",
			});
		}
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// prune uploads but not one that in use
export const PruneUploads = async (req: Request, res: Response): Promise<void> => {
	try {
		const { app } = req.params;
		// get app
		const item = await AppService.GetApp(app);
		let onuse = ""; // empty onuse if no app exists
		if (item) {
			// prune uploads
			if (item.source.includes("upload:")) {
				onuse = item.source.replace("upload:", "");
			} else {
				res.status(400).json({
					status: false,
					code: 400,
					message: "Invalid source",
				});
				return; // break if invalid source
			}
		}
		const result = await UploadService.PruneUploads(app, onuse);
		res.json({
			status: true,
			code: 200,
			message: "Uploads pruned",
			count: result.length,
			data: result,
		});
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// download uploaded file
export const DownloadUpload = async (req: Request, res: Response): Promise<void> => {
	try {
		const { app, id } = req.params;
		// get upload
		const upload = await UploadService.GetUpload(app, id);
		// if upload exists
		if (upload) {
			// file path
			const file = path.join(__dirname, "../../", upload.path);
			// check file exists
			if (fs.existsSync(file)) {
				// download file
				res.download(file);
			} else {
				res.status(404).json({
					status: false,
					code: 404,
					message: "File not found",
				});
			}
		} else {
			res.status(404).json({
				status: false,
				code: 404,
				message: "Upload not found",
			});
		}
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// export default all functions
export default {
	AddUpload,
	GetUploads,
	GetUpload,
	DeleteUpload,
	PruneUploads,
	DownloadUpload,
};
