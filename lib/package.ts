import { Router } from "express";
// lib
import { Logger } from "@lib/logger";
import { AuthMiddleware } from "@lib/auth";

interface PackageOptions {
	name: string;
	prefix: string;
	routes: Router;
	auth?: boolean;
}

export const definePackage = (options: PackageOptions) => {
	return () => {
		if (options.prefix.startsWith("/")) {
			options.prefix = options.prefix.replace("/", "");
		}
		Logger.info(`Package ${options.name} loaded in /api/v1/${options.prefix}`);
		if (options.auth) {
			return {
				prefix: options.prefix,
				routes: [AuthMiddleware, options.routes],
			};
		} else {
			return {
				prefix: options.prefix,
				routes: [options.routes],
			};
		}
	};
};
