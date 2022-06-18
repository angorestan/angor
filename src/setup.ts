// lib
import { Auth } from "@lib/auth";
import { Logger } from "@lib/logger";
// log init message
Logger.info("Server wants to start");
// get some env config and print theme
const { UPLOAD_DEST, APP_DEST } = process.env;
Logger.info(`Upload destination: ${UPLOAD_DEST}`);
Logger.info(`App destination: ${APP_DEST}`);
// get user auth env config and print theme and save to RAM
const { AUTH_USERNAME, AUTH_PASSWORD } = process.env;
// get user from redis and print theme if user is found else set user to redis
Auth.GetUser().then((result) => {
	if (!result) {
		Auth.SetUser({
			username: AUTH_USERNAME as string,
			password: AUTH_PASSWORD as string,
		});
	}
});
