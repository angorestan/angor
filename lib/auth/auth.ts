// lib
import Redis from "@lib/redis";
// util
import Bcrypt from "./bcrypt";

export interface IAuthUser {
	username: string;
	password: string;
}
// set user to redis
export const SetUser = async (user: IAuthUser) => {
	user.password = await Bcrypt.hashPassword(user.password);
	Redis.set("angor:user", JSON.stringify(user));
};

// get user from redis
export const GetUser = async (): Promise<IAuthUser | undefined> => {
	const result = await Redis.get("angor:user");
	return result ? JSON.parse(result) : undefined;
};

export default {
	SetUser,
	GetUser,
};
