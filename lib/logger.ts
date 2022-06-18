// import packages
import path from "path";
import colors from "colors/safe";
// import winston
import Winston from "winston";
// get winston config from env
let { WINSTON_DEST } = process.env;

const WINSTON_ENABLE: boolean = WINSTON_DEST != undefined;

if (!WINSTON_DEST) {
	WINSTON_DEST = path.join(__dirname, "./logs");
}

const files = {
	info: path.join(WINSTON_DEST as string, "info.log"),
	error: path.join(WINSTON_DEST as string, "error.log"),
};

const format = {
	file: Winston.format.combine(
		Winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		Winston.format.printf(
			(info) =>
				JSON.stringify({
					time: info.timestamp,
					level: info.level,
					message: info.message,
				}) + ","
		)
	),
	console: (color: any) =>
		Winston.format.combine(
			Winston.format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss",
			}),
			Winston.format.printf((info) => `${color(`[${info.level.toUpperCase()}]`)} ${colors.gray(info.timestamp)} ${info.message}`)
		),
};

const transport = {
	file: [
		new Winston.transports.File({
			filename: files.info,
			level: "info",
			format: format.file,
		}),
		new Winston.transports.File({
			filename: files.error,
			level: "error",
			format: format.file,
		}),
	],
	console: [
		new Winston.transports.Console({
			level: "info",
			format: format.console(colors.blue),
		}),
		new Winston.transports.Console({
			level: "error",
			format: format.console(colors.red),
		}),
	],
};

let transports: Winston.transport[] = [...transport.console];
if (WINSTON_ENABLE) {
	transports.push(...transport.file);
}

// Create a new Winston Logger.
export const Logger = Winston.createLogger({
	transports: transports,
});

export default Logger;
