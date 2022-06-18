export interface IApp {
	name: string; // app name
	secure: boolean; // app use secure protocol like HTTPS
	domain: string; // app domain
	port: number; // app start port
	host: string; // app start host
	entrypoint: string; // app entrypoint from host and port
	path: string; // app folder path
	source: string; // app source, if start with "upload:" means uploaded file directly, if start with "git:" means git url
	startup: undefined | string | string[]; // app start script command
	destroy: undefined | string | string[]; // app destroy script command
}
