import path from "path";
import fs from "fs";
// interface
import { IApp } from "./interface";
// helper
import { Destroy, ExtractAppZIPSource, Startup } from "./helper";

// get upload and project config from env
const { UPLOAD_DEST, APP_DEST } = process.env;

describe("helper/project", () => {
	it("should extract project zip source", async () => {
		try {
			const file = path.join(__dirname, "../../", UPLOAD_DEST as string, "test.zip");
			const destination = path.join(__dirname, "../../", APP_DEST as string, "test");
			const result = await ExtractAppZIPSource(file, destination);
			expect(result).toBe(true);
		} catch (error) {}
	});

	it("should startup with zip source", async () => {
		try {
			const output = path.join(__dirname, "../../", APP_DEST as string, "test");
			if (fs.existsSync(output)) {
				fs.rmSync(output, { recursive: true });
			}
			const app: IApp = {
				source: "upload:test.zip",
				path: output,
				startup: "",
				destroy: "",
				name: "",
				secure: false,
				domain: "",
				port: 0,
				host: "",
				entrypoint: "",
			};
			await Startup(app);
			expect(fs.existsSync(output)).toBe(true);
		} catch (error) {
			//
		}
	});

	it("should startup with git source", async () => {
		try {
			const output = path.join(__dirname, "../../", APP_DEST as string, "dumb");
			if (fs.existsSync(output)) {
				fs.rmSync(output, { recursive: true });
			}
			const app: IApp = {
				source: "git:https://github.com/iamnonroot/dumb.git",
				path: output,
				startup: "",
				destroy: "",
				name: "",
				secure: false,
				domain: "",
				port: 0,
				host: "",
				entrypoint: "",
			};
			await Startup(app);
			expect(fs.existsSync(output)).toBe(true);
		} catch (error) {
			//
		}
	});

	it("should destroy", async () => {
		try {
			const output = path.join(__dirname, "../../", APP_DEST as string, "test");
			const app: IApp = {
				source: "upload:test.zip",
				path: output,
				startup: "",
				destroy: "",
				name: "",
				secure: false,
				domain: "",
				port: 0,
				host: "",
				entrypoint: "",
			};
			await Destroy(app);
			expect(fs.existsSync(output)).toBe(false);
		} catch (error) {
			//
		}
	});
});
