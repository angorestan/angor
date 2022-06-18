// Router from express
import { Router } from "express";
// controllers
import Controller from "./controller";
// midlewares
import middleware from "./middleware";

const router = Router();

router.get("/", Controller.GetAllApps);
router.get("/:name", Controller.GetApp);
router.get("/:name/traefik", Controller.GetAppTraefik);
router.post("/", middleware.ValidateApp, Controller.CreateApp);
router.delete("/:name", Controller.DeleteApp);

export default router;
