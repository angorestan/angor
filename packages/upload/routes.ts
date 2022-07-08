// Router from express
import { Router } from "express";
// controllers
import Controller from "./controller";
// middleware
import { UploadMiddleware } from "./middleware";

const router = Router();

router.post("/:app", UploadMiddleware.single("source"), Controller.AddUpload);
router.get("/:app", Controller.GetUploads);
router.get("/:app/:id", Controller.GetUpload);
router.get("/:app/:id/download", Controller.DownloadUpload);
router.delete("/:app/prune", Controller.PruneUploads);
router.delete("/:app/:id", Controller.DeleteUpload);

export default router;
