import fs from "fs";
import { join } from "path";
// Request and Response from express
import { Request, Response } from "express";
// services
import AppService from "@packages/app/services";
// lib
import { Logger } from "@lib/logger";
// helper
import { walk } from "./helper";

export const Walk = async (req: Request, res: Response) => {
	try {
		const { app } = req.params;
		const { path } = req.body;
		// check app exist
		const item = await AppService.GetApp(app);
		if (item) {
			const source = item.path;
			const directory = join(source, path ?? "/");
			res.json({
				status: true,
				code: 200,
				data: walk(directory),
			});
		} else {
			res.json({
				status: false,
				code: 404,
				message: "App not found",
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

export const Delete = async (req: Request, res: Response) => {
	try {
		const { app } = req.params;
		const { path } = req.body;
		// check app exist
		const item = await AppService.GetApp(app);
		if (item) {
			const source = item.path;
			const directory = join(source, path ?? "/");

			fs.rmSync(directory, { force: true, recursive: true });

			res.json({
				status: true,
				code: 200,
			});
		} else {
			res.json({
				status: false,
				code: 404,
				message: "App not found",
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

export default {
	Walk,
	Delete,
};
