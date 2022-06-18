// lib
import { definePackage } from "@lib/package";
// router
import router from "./routes";

export default definePackage({
	name: "app",
	prefix: "/app",
	routes: router,
	auth: true,
});
