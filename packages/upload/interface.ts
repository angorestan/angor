export interface IUpload {
	id: string; // uploadedAt to timestamp
	app: string;
	uploadedAt: Date;
	originalname: string;
	encoding: string;
	mimetype: string;
	destination: string;
	filename: string;
	path: string;
	size: number;
}
