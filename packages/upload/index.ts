// lib
import { definePackage } from "@lib/package";
// router
import router from "./routes";

export default definePackage({
	name: "upload",
	prefix: "/upload",
	routes: router,
	auth: true,
});
