// utils
import Redis from "@lib/redis";
// interface
import { IApp } from "./interface";

// get app from redis by app name
export const GetApp = async (name: string): Promise<IApp | undefined> => {
	const result = await Redis.get(`app:${name}`);
	return result ? JSON.parse(result) : undefined;
};

// set app to redis by app name
export const SetApp = async (app: IApp): Promise<void> => {
	await Redis.set(`app:${app.name}`, JSON.stringify(app));
};

// delete app from redis by app name
export const DeleteApp = async (name: string): Promise<void> => {
	await Redis.del(`app:${name}`);
};

// get all apps from redis
export const GetAllApps = async (): Promise<IApp[]> => {
	const keys = await Redis.keys("app:*");
	const result = keys.map(async (key: string) => {
		return (await GetApp(key.replace("app:", "")))! as IApp;
	});
	return Promise.all(result);
};

// check app name is exist or not
export const IsAppExist = async (name: string): Promise<boolean> => {
	const result = await Redis.get(`app:${name}`);
	return result ? true : false;
};

export default {
	GetApp,
	SetApp,
	DeleteApp,
	GetAllApps,
	IsAppExist,
};
