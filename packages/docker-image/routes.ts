// Router from express
import { Router } from "express";
// controllers
import Controller from "./controller";
// middlewares
import Middleware from "./midleware";

const router = Router();

router.post("/", Middleware.ValidateDockerImage, Controller.SetDockerImage);
router.get("/", Controller.GetDockerImages);
router.get("/system", Controller.GetSystemDockerImages);
router.get("/:name/:tag", Controller.GetDockerImage);
router.delete("/:name/:tag", Controller.DeleteDockerImage);
router.delete("/system/:name/:tag", Controller.DeleteSystemDockerImage);
router.post("/system/:name/:tag/pull", Controller.PullDockerImage);

export default router;
