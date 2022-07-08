// lib
import { definePackage } from "@lib/package";
// router
import router from "./routes";

export default definePackage({
	name: "docker image",
	prefix: "/docker/image",
	routes: router,
});
