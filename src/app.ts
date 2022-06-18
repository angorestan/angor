// import packages
import cors from "cors";
import morgan from "morgan";
import express from "express";
// lib
import { App } from "@lib/express";
import { Logger } from "@lib/logger";
// packages
import Packages from "@packages/index";
// add cors middleware
App.use(cors());
// add express json middleware
App.use(express.json());
// add morgon http logger middleware
App.use(
	morgan("tiny", {
		stream: {
			write: (message: string) => {
				Logger.info(message.replace("\n", ""));
			},
		},
	})
);
// load packages routes
for (let item of Packages) {
	const { prefix, routes } = item();
	App.use(`/api/v1/${prefix}`, ...routes);
}
// send error 404 for all other routes
App.all("*", (req, res) => {
	res.status(404).json({
		status: false,
		code: 404,
		message: "Route not found",
	});
});
// PORT from env.PORT else on port 3200
const PORT = process.env.PORT || 3200;
// start the server
App.listen(PORT, () => {
	Logger.info(`Server started on port ${PORT}`);
});
