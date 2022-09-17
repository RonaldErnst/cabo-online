import { useChat } from "@contexts/ChatContext";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRef } from "react";
import validateChatMessage from "utils/validateChatMessage";
import ChatMessage from "./ChatMessage";

interface FormValues {
	message: string;
}

const Chat = () => {
	const { messages, sendMessage } = useChat();
    const inputRef = useRef<HTMLElement>(null);
	const initialValues = {
		message: "",
	};

	const handleSubmit = (
		{ message }: FormValues,
		{ setSubmitting, setFieldValue }: FormikHelpers<FormValues>
	) => {
		setSubmitting(true);
		validateChatMessage(message).match(
			(msg) => {
				sendMessage(msg);
				setFieldValue("message", "");
			},
			(err) => {
                // TODO: show error?
                console.log(err);
            }
		);
		setSubmitting(false);
	};

	return (
		<div className="w-96 flex flex-col gap-4 p-4 bg-slate-600">
			<div className="grow flex flex-col">
				{messages.map((m, i) => (
					<ChatMessage key={i} message={m} />
				))}
			</div>
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
					<Form className="flex flex-row justify-center items-center gap-4">
						<Field // TODO: display error with red highlight and icon with hover
							innerRef={inputRef}
							// TODO: validate message, trim, remove linebreaks, etc
							name="message"
							placeholder="Enter message"
							className="w-full h-10 p-2 rounded-md"
						/>
						<div className="flex flex-row gap-12 justify-center">
							<button
								className="bg-orange-500 py-2 px-4 rounded-lg transition active:scale-95 hover:bg-orange-400 disabled:bg-slate-5"
								disabled={isSubmitting}
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									handleSubmit();
									inputRef.current?.focus();
								}}
							>
								Chat
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Chat;
