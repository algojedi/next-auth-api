/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

interface CreateUserInput {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
}

function RegisterPage() {
	const router = useRouter();
	const [registerError, setRegisterError] = useState<string>();
	const {
		register,
		handleSubmit,
	} = useForm<CreateUserInput>();

	async function onSubmit(values: CreateUserInput) {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
				values
			);
			router.push("/");
		} catch (e: any) {
			setRegisterError(e.message);
		}
	}

	return (
		<>
			<p>{registerError}</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-element">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						placeholder="jane.doe@example.com"
						{...register("email")}
					/>
				</div>

				<div className="form-element">
					<label htmlFor="name">Name</label>
					<input
						id="name"
						type="text"
						placeholder="Jane Doe"
						{...register("name")}
					/>
				</div>

				<div className="form-element">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						placeholder="*********"
						{...register("password")}
					/>
				</div>

				<div className="form-element">
					<label htmlFor="passwordConfirmation">Confirm password</label>
					<input
						id="passwordConfirmation"
						type="password"
						placeholder="*********"
						{...register("passwordConfirmation")}
					/>
				</div>
				<button type="submit">SUBMIT</button>
			</form>
		</>
	);
}

export default RegisterPage;
