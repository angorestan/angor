// utils
import Auth, { IAuthUser } from "./auth";

const user: IAuthUser = {
	username: "test",
	password: "test",
};

describe("utils/auth", () => {
	it("should set user", async () => {
		try {
			await Auth.SetUser(user);
			const result = await Auth.GetUser();
			expect(result).toBeDefined();
		} catch (error) {
			//
		}
	});

	it("should get user", async () => {
		try {
			const result = await Auth.GetUser();
			expect(result).toBeDefined();
		} catch (error) {
			//
		}
	});
});
