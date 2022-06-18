// import packages
import path from "path";
// Request and Response are from express.
import { Request, Response } from "express";
// services
import AppService from "./services";
import TraefikService from "@packages/traefik/services";
import { PruneUploads } from "@packages/upload/services";
// interfaces
import { IApp } from "./interface";
// helper
import { Destroy, Startup } from "./helper";
// utils
import { Logger } from "@lib/logger";

// get app config from env
const { APP_DEST } = process.env;
// get traefik config from env
const { TRAEFIK_HOST } = process.env;

// get app from redis by app name
export const GetApp = async (req: Request, res: Response): Promise<void> => {
	try {
		const name = req.params.name;
		const app = await AppService.GetApp(name);
		if (app) {
			res.json({
				status: true,
				code: 200,
				message: "App found",
				data: app,
			});
		} else {
			res.status(404).json({
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

// get all apps
export const GetAllApps = async (req: Request, res: Response): Promise<void> => {
	try {
		const apps = await AppService.GetAllApps();
		res.json({
			status: true,
			code: 200,
			message: "Apps found",
			count: apps.length,
			data: apps,
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

// get app traefik config from redis by app name
export const GetAppTraefik = async (req: Request, res: Response): Promise<void> => {
	try {
		const name = req.params.name;
		const traefik = await TraefikService.GetTraefik(name);
		if (traefik && traefik.domain != null) {
			res.json({
				status: true,
				code: 200,
				message: "Traefik config found",
				data: traefik,
			});
		} else {
			res.status(404).json({
				status: false,
				code: 404,
				message: "Traefik config not found",
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

// create new app
export const CreateApp = async (req: Request, res: Response): Promise<void> => {
	try {
		let body = req.body as IApp;
		if (await AppService.IsAppExist(body.name)) {
			res.status(409).json({
				status: false,
				code: 409,
				message: "App already exist",
			});
		} else {
			// check secure is true or false
			body.secure = body.secure ?? false;
			// check host is sent or use default docker internal
			body.host =
				body.host == undefined || body.host.length == 0
					? (TRAEFIK_HOST as string) // default host : 127.0.0.1
					: body.host;
			// set entrypoint from host and port
			body.entrypoint = `http://${body.host}:${body.port}`;
			// check source is sent or ''
			body.source = body.source == undefined ? "" : body.source;
			// set path from app name
			body.path = path.join(APP_DEST as string, body.name);
			// start app syncronously
			(async () => {
				// make app startup
				await Startup(body);
				// save app to redis
				await AppService.SetApp(body);
				// set traefik config for app to redis
				await TraefikService.SetTraefik(body);
			})();
			res.json({
				status: true,
				code: 200,
				message: "App created",
				data: body,
			});
		}
	} catch (error) {
		console.error(error);
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal server error",
		});
	}
};

// delete app
export const DeleteApp = async (req: Request, res: Response): Promise<void> => {
	try {
		const name = req.params.name;
		// get app by name
		const app = await AppService.GetApp(name);
		if (app) {
			// destroy app syncronously
			(async () => {
				// destroy app
				await Destroy(app);
				// destroy uploads of app
				await PruneUploads(app.name, "");
				// delete app from redis
				await AppService.DeleteApp(name);
				// delete traefik config from redis
				await TraefikService.DeleteTraefik(name);
			})();
			res.json({
				status: true,
				code: 200,
				message: "App deleted",
			});
		} else {
			res.status(404).json({
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

// export default all functions
export default {
	GetApp,
	GetAllApps,
	GetAppTraefik,
	CreateApp,
	DeleteApp,
};
