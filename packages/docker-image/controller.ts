import { Request, Response } from "express";
// lib
import Logger from "@lib/logger";
// service
import Services from "./services";
// interfaces
import { IDockerImage } from "./interface";

export const SetDockerImage = async (req: Request, res: Response) => {
	try {
		let image: IDockerImage = req.body;
		// set empty env if env is undefined
		if (image.config.env == undefined) image.config.env = [];
		// set empty vol if vol is undefined
		if (image.config.vol == undefined) image.config.vol = [];
		// save docker image
		await Services.SetDockerImage(image);
		res.json({
			status: true,
			code: 200,
			data: req.body,
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

export const GetDockerImage = async (req: Request, res: Response) => {
	try {
		const { name, tag } = req.params;
		// get docker image by name and tag
		const image = await Services.GetDockerImage(name, tag);
		// if docker image exists
		if (image) {
			res.json({
				status: true,
				code: 200,
				data: image,
			});
		} else {
			res.json({
				status: false,
				code: 404,
				message: "Image not found",
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

export const GetDockerImages = async (req: Request, res: Response) => {
	try {
		const images = await Services.GetDockerImages();
		res.json({
			status: true,
			code: 200,
			data: images,
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

export const GetSystemDockerImages = async (req: Request, res: Response) => {
	try {
		const images = await Services.GetSystemDockerImages();
		res.json({
			status: true,
			code: 200,
			data: images,
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

export const DeleteDockerImage = async (req: Request, res: Response) => {
	try {
		const { name, tag } = req.params;
		// get docker image by name and tag
		const image = await Services.GetDockerImage(name, tag);
		// if docker image exists
		if (image) {
			// delete docker image by name and tag
			await Services.DeleteDockerImage(name, tag);
			res.json({
				status: true,
				code: 200,
			});
		} else {
			res.json({
				status: false,
				code: 404,
				message: "Image not found",
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

export const DeleteSystemDockerImage = async (req: Request, res: Response) => {
	try {
		const { name, tag } = req.params;
		// pull docker image by name and tag
		await Services.DeleteSystemDockerImage(name, tag);
		res.json({
			status: true,
			code: 200,
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

export const PullDockerImage = async (req: Request, res: Response) => {
	try {
		const { name, tag } = req.params;
		// pull docker image by name and tag
		await Services.PullDockerImage(name, tag);
		res.json({
			status: true,
			code: 200,
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

export default {
	SetDockerImage,
	GetDockerImage,
	GetDockerImages,
	GetSystemDockerImages,
	DeleteDockerImage,
	DeleteSystemDockerImage,
	PullDockerImage,
};
