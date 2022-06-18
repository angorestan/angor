// lib
import Redis from "@lib/redis";
// interfaces
import { IApp } from "@packages/app/interface";
import { ITraefikConfig } from "./interface";
// helper
import Helper from "./helper";
// services
import { GetAllApps } from "@packages/app/services";

// set traefik config for a app
export const SetTraefik = async (app: IApp): Promise<void> => {
	const keys = Helper.GetTraefikKeys(app.name);
	await Promise.all([
		Redis.set(keys.endpoint, app.entrypoint),
		Redis.set(keys.domain, `HOST(\`${app.domain}\`)`),
		Redis.set(keys.app, `${app.name}`),
		Redis.set(keys.protocol, app.secure ? `https` : `http`),
		Redis.set(keys.tls, app.secure ? `true` : `false`),
		Redis.set(keys.cert, process.env.TRAEFIK_CERT as string),
	]);
};

// get traefik config for a app
export const GetTraefik = async (name: string): Promise<ITraefikConfig> => {
	const keys = Helper.GetTraefikKeys(name);
	const result = await Promise.all([Redis.get(keys.endpoint), Redis.get(keys.domain), Redis.get(keys.app), Redis.get(keys.protocol), Redis.get(keys.tls), Redis.get(keys.cert)]);

	return {
		endpoint: result[0]!,
		domain: result[1]!,
		app: result[2]!,
		protocol: result[3]!,
		tls: result[4]!,
		cert: result[5]!,
	};
};

// delete traefik config for a app
export const DeleteTraefik = async (name: string): Promise<void> => {
	const keys = Helper.GetTraefikKeys(name);
	await Promise.all([Redis.del(keys.endpoint), Redis.del(keys.domain), Redis.del(keys.app), Redis.del(keys.protocol), Redis.del(keys.tls), Redis.del(keys.cert)]);
};

export const LoadAllForTraefik = async () => {
	const apps = await GetAllApps();

	const routers = apps
		.map((item) => ({
			[item.name]: Helper.CreateRouter(item),
		}))
		.reduce((prev, curr) => Object.assign(prev, curr), {});

	const services = apps
		.map((item) => ({
			[item.name]: Helper.CreateService(item),
		}))
		.reduce((prev, curr) => Object.assign(prev, curr), {});

	return {
		routers,
		services,
	};
};

export default {
	GetTraefik,
	SetTraefik,
	DeleteTraefik,
	LoadAllForTraefik,
};
