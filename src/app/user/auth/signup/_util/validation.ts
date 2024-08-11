import zod from "zod";

export const signupSchema = zod
	.object({
		email: zod.string().email(),

		name: zod.string().refine(
			(value) => {
				const [firstName, lastName] = value.split(" ");

				return firstName.length >= 2 && lastName.length >= 2;
			},
			{
				message: "Name must have both first and last name",
			}
		),
		password: zod
			.string()
			.min(8)
			.refine(
				(value) => {
					const hasUpperCase = /[A-Z]/.test(value);
					const hasLowerCase = /[a-z]/.test(value);
					const hasNumber = /[0-9]/.test(value);
					const hasSymbol = /[!@#$%^&*]/.test(value);

					return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
				},
				{
					message:
						"Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol",
				}
			),
		confirmPassword: zod.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export function validateSignup(data: any) {
	try {
		signupSchema.parse(data);

		return null;
	} catch (error) {
		if (error instanceof zod.ZodError) {
			const formErrors = error.errors.reduce(
				(acc, curr) => {
					const key = curr.path.join(".");

					acc[key] = curr.message;

					return acc;
				},
				{} as { [key: string]: string }
			);

			

			return formErrors;
		}

		return error;
	}
}

export default {};
