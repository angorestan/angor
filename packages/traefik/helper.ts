// interfaces
import { IApp } from "@packages/app/interface";
import { ITraefikRouter, ITraefikService, ITraefikConfig } from "./interface";

export const CreateRouter = (app: IApp): ITraefikRouter => {
	let router: ITraefikRouter = {
		rule: `HOST(\`${app.domain}\`)`,
		service: `${app.name}`,
	};

	if (app.secure) {
		router = {
			...router,
			tls: {
				certResolver: process.env.TRAEFIK_CERT as string,
			},
		};
	}

	return router;
};

export const CreateService = (app: IApp): ITraefikService => ({
	loadBalancer: {
		servers: [
			{
				url: app.entrypoint,
			},
		],
	},
});

export const GetTraefikKeys = (name: string): ITraefikConfig => {
	return {
		endpoint: `traefik/http/services/${name}/loadbalancer/servers/0/url`, // app local server endpoint, ex: http://127.0.0.1:8080
		domain: `traefik/http/routers/${name}/rule`, // app domain name, ex: whoami.nroot.ir
		app: `traefik/http/routers/${name}/service`, // app name, ex: whoami
		protocol: `traefik/http/routers/${name}/entrypoints/0`, // app protocol, ex: http, https
		tls: `traefik/http/routers/${name}/tls`, // app tls, ex: true
		cert: `traefik/http/routers/${name}/tls/certResolver`, // app tls cert, ex: whoami.nroot.ir
	};
};

export default {
	CreateRouter,
	CreateService,
	GetTraefikKeys,
};
