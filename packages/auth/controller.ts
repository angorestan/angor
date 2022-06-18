// Request and Response from express
import { Request, Response } from "express";
// lib
import { Auth } from "@lib/auth";
import { Logger } from "@lib/logger";

// auth login
export const Login = async (req: Request, res: Response) => {
	res.json({
		status: true,
		code: 200,
		message: "Login Success",
		data: (req as any).user,
	});
};

// auth change username and password
export const Change = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		await Auth.SetUser({ username, password });
		res.json({
			status: true,
			code: 200,
			message: "Change Success",
			data: { username, password },
		});
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			status: false,
			code: 500,
			error: "Internal server error",
		});
	}
};

export default {
	Login,
	Change,
};
