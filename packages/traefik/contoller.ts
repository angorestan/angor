// Request and Response from express
import { Request, Response } from "express";
// service
import TraefikService from "./services";

export const LoadAllForTraefik = async (req: Request, res: Response): Promise<void> => {
	try {
		const http = await TraefikService.LoadAllForTraefik();

		res.json({
			http,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			code: 500,
		});
	}
};

export default {
	LoadAllForTraefik,
};
