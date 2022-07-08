// import packages
import multer from "multer";
// get multer config from env
const { UPLOAD_DEST } = process.env;

// create multer storage for zip files
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (["application/zip", "application/x-zip-compressed"].includes(file.mimetype)) {
			cb(null, UPLOAD_DEST as string);
		} else {
			cb(new Error("Invalid file type"), UPLOAD_DEST as string);
		}
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.originalname.replace(".zip", "").split(" ").join("-") + "-" + uniqueSuffix + ".zip");
	},
});

// create multer instance
export const UploadMiddleware = multer({
	storage: storage,
});
