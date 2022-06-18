export interface ITraefikRouter {
	rule: string;
	service: string;
	tls?: {
		certResolver: string;
	};
}

export interface ITraefikService {
	loadBalancer: {
		servers: [
			{
				url: string;
			}
		];
	};
}

export type TTraefikKeys = "endpoint" | "domain" | "app" | "protocol" | "tls" | "cert";
// Interface for traefik config for each TTraefikKeys
export type ITraefikConfig = {
	[key in TTraefikKeys]: string;
};
