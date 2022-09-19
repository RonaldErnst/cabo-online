import { useChat } from "@contexts/ChatContext";
import {
	FormEventHandler,
	KeyboardEventHandler,
	useRef,
	useState,
} from "react";
import TextAreaAutosize from "react-textarea-autosize";
import validateChatMessage from "utils/validateChatMessage";

const ChatInputField = () => {
	const { sendMessage } = useChat();
	const formRef = useRef<HTMLFormElement | null>(null);
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const [isSubmitting, setSubmitting] = useState(false);
	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		if (inputRef.current === null) return;

		setSubmitting(true);

		validateChatMessage(inputRef.current.value).match(
			(msg) => {
				sendMessage(msg);

				if (inputRef.current !== null) inputRef.current.value = "";
			},
			(err) => {
				// TODO: show error?
				console.log(err);
			}
		);

		setSubmitting(false);

		inputRef.current.focus();
	};

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        console.log(e.code)
		if (!e.shiftKey && e.code.includes("Enter")) {
			e.preventDefault();
			formRef.current?.requestSubmit();
		}
	};

	return (
		<form
			ref={formRef}
			className="flex flex-row justify-center items-center gap-4"
			onSubmit={handleSubmit}
		>
			<TextAreaAutosize
				maxRows={4}
				ref={inputRef}
				name="message"
				placeholder="Enter message"
				className="w-full h-10 p-2 rounded-md resize-none"
				onKeyDown={handleKeyDown}
			/>
			<div className="flex flex-row gap-12 justify-center">
				<button
					className="bg-orange-500 py-2 px-4 rounded-lg transition active:scale-95 hover:bg-orange-400 disabled:bg-slate-5"
					disabled={isSubmitting}
					type="submit"
				>
					Chat
				</button>
			</div>
		</form>
	);
};

export default ChatInputField;
