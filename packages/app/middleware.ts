// import packages
import Joi from "joi";
// Request and Response are from express
import { Request, Response, NextFunction } from "express";
// interface for app schema
import { IApp } from "./interface";

const appSchema = Joi.object<IApp>({
	name: Joi.string().required(),
	secure: Joi.boolean(),
	domain: Joi.string().required(),
	port: Joi.number().required(),
	host: Joi.string(),
	source: Joi.string(),
	startup: [Joi.string().empty(""), Joi.array().empty()],
	destroy: [Joi.string().empty(""), Joi.array().empty()],
});

// validate app middleware
export const ValidateApp = (req: Request, res: Response, next: NextFunction) => {
	const { error } = appSchema.validate(req.body);
	if (error) {
		// error detail in index 0 message replace all '"' with '\''
		const message = error.details[0].message.replace(/"/g, "'");
		return res.status(400).json({
			status: false,
			code: 400,
			message: message,
		});
	}
	next();
};

export default {
	ValidateApp,
};
