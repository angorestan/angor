// Request and Response are from express
import { Request, Response, NextFunction } from "express";
// utils
import Auth from "./auth";
import Bcrypt from "./bcrypt";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const header: string | undefined = req.headers.authorization;
		if (!header) {
			res.status(401).send({
				status: false,
				code: 401,
				message: "No authorization header",
			});
		} else {
			// basic auth header
			const auth = Buffer.from(header.split(" ")[1], "base64").toString().split(":");

			const [username, password] = auth;
			const result = await Auth.GetUser();
			if (!result) {
				res.status(401).send({
					status: false,
					code: 401,
					message: "No user found",
				});
			} else {
				if (result.username === username && (await Bcrypt.comparePassword(password, result.password))) {
					(req as any).user = {
						username,
						password,
					};
					next();
				} else {
					res.status(401).send({
						status: false,
						code: 401,
						message: "Invalid username or password",
					});
				}
			}
		}
	} catch (error) {
		res.status(500).json({
			status: false,
			code: 500,
			message: "Internal Server Error",
		});
	}
};
