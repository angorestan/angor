// lib
import { definePackage } from "@lib/package";
// router
import router from "./routes";

export default definePackage({
	name: "auth",
	prefix: "/auth",
	routes: router,
});
