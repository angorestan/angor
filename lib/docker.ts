import Dockerode from "dockerode";
// lib
import Logger from "./logger";

const docker = new Dockerode();

docker
	.version()
	.then(() => {
		Logger.info("Docker client connected");
	})
	.catch((error) => {
		Logger.error("Docker client connection failed");
		Logger.error(error);
	});

export default docker;
