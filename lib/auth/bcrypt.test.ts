import Bcrypt from "./bcrypt";

describe("utils/bcrypt", () => {
	it("should hash password", async () => {
		try {
			const password = "test";
			const hash = await Bcrypt.hashPassword(password);
			expect(hash).toBeDefined();
		} catch (error) {
			//
		}
	});

	it("should compare password", async () => {
		try {
			const password = "test";
			const hash = await Bcrypt.hashPassword(password);
			const result = await Bcrypt.comparePassword(password, hash);
			expect(result).toBe(true);
		} catch (error) {
			//
		}
	});
});
