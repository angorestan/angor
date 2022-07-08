// Router from express
import { Router } from "express";
// controllers
import Controller from "./controller";

const router = Router();

router.post("/:app/walk", Controller.Walk);
router.delete("/:app/delete", Controller.Delete);

export default router;
