// Router from express
import { Router } from "express";
// controllers
import Controller from "./contoller";

const router = Router();

router.get("/provider", Controller.LoadAllForTraefik);

export default router;
