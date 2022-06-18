import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};

export default {
	hashPassword,
	comparePassword,
};
