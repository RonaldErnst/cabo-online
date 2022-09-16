import ErrorAlert from "@components/ErrorAlert";
import { useSocket } from "@contexts/SocketContext";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRef } from "react";
import * as Yup from "yup";

interface FormValues {
	password: string;
}

function PasswordPrompt() {
    const socket = useSocket();
	const inputRef = useRef<HTMLElement>(null);
	const initialValues = { password: "" };

	const handleSubmit = (
		values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>
	) => {
        setSubmitting(true);

        // TODO check password

        setSubmitting(false);
    };

	return (
		<div className="bg-slate-700 w-full h-full flex flex-col justify-center items-center">
			<Formik<FormValues>
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnBlur={false}
				validateOnChange={false}
			>
				{({
					setFieldValue,
					handleSubmit,
					isSubmitting,
					errors,
					setFieldError,
				}) => (
					<Form className="flex flex-col justify-center items-center gap-4 p-16 rounded-xl drop-shadow-lg bg-slate-600">
						{errors.password ? (
							<ErrorAlert
								error={errors.password}
								clearError={() =>
									setFieldError("password", undefined)
								}
							/>
						) : null}
						<Field
							innerRef={inputRef}
							name="password"
							placeholder="Enter password to join room..."
							className="w-80 h-12 p-2 rounded-md text-xl"
						/>
						<div className="flex flex-row gap-12 justify-center text-lg">
							<button
								className="bg-orange-500 py-2 px-4 rounded-lg transition active:scale-95 hover:bg-orange-400 disabled:bg-slate-5"
								disabled={isSubmitting}
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									setFieldValue("shouldCreateRoom", true);
									handleSubmit();
									inputRef.current?.focus();
								}}
							>
								Join Room
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default PasswordPrompt;
