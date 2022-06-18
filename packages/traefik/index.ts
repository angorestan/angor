// lib
import { definePackage } from "@lib/package";
// router
import router from "./routes";

export default definePackage({
	name: "traefik",
	prefix: "/traefik/v3",
	routes: router,
});
