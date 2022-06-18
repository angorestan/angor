// lib
import { definePackage } from "@lib/package";
// router
import router from "./routes";

export default definePackage({
	name: "upload",
	prefix: "/upload/source",
	routes: router,
	auth: true,
});
