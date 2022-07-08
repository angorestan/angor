// import packages
import Joi from "joi";
// Request and Response are from express
import { Request, Response, NextFunction } from "express";
// interface for docker image schema
import { IDockerImage } from "./interface";

const dockerImageSchema = Joi.object<IDockerImage>({
	thumbnail: Joi.string().required(),
	name: Joi.string().required(),
	tag: Joi.string().required(),
	category: Joi.string().required(),
	config: Joi.object({
		port: Joi.array().items(Joi.number().required()).required(),
		env: Joi.array().items(Joi.string()).required(),
		vol: Joi.array().items(Joi.string()).required(),
	}).required(),
});

// validate docker image middleware
export const ValidateDockerImage = (req: Request, res: Response, next: NextFunction) => {
	const { error } = dockerImageSchema.validate(req.body);
	if (error) {
		// error detail in index 0 message replace all '"' with '\''
		const message = error.details[0].message.replace(/"/g, "'");
		return res.json({
			status: false,
			code: 400,
			message: message,
		});
	}
	next();
};

export default {
	ValidateDockerImage,
};
