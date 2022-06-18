// helper
import { CreateRouter } from "./helper";
// interface
import { IApp } from "@packages/app/interface";

// get traefik config from env
const { TRAEFIK_CERT } = process.env;

let app: IApp = {
	name: "test",
	secure: true,
	domain: "test.com",
	port: 80,
	host: "",
	entrypoint: "",
	path: "",
	source: "",
	startup: [],
	destroy: [],
};

describe("helper/traefik", () => {
	it("should create traefik router secure", () => {
		const router = CreateRouter(app);
		expect(router).toEqual({
			rule: `HOST(\`${app.domain}\`)`,
			service: app.name,
			tls: {
				certResolver: TRAEFIK_CERT as string,
			},
		});
	});
});
