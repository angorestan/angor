export interface IFile {
	name: string;
	size: number;
	path: string;
	mode: string;
	directory: boolean;
	createdAt: Date | string | number;
	updatedAt: Date | string | number;
}
