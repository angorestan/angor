// Router from express
import { Router } from "express";
// controllers
import Controller from "./controller";

const router = Router();

router.post("/login", Controller.Login);
router.post("/change", Controller.Change);

export default router;
