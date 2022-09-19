import { useChat } from "@contexts/ChatContext";
import ChatInputField from "./ChatInputField";
import ChatMessage from "./ChatMessage";

const Chat = () => {
	const { messages } = useChat();

	return (
		<div className="w-96 flex flex-col gap-4 p-4 bg-slate-600">
			<div className="grow w-full flex flex-col gap-y-2 overflow-y-auto justify-items-stretch">
				{messages.map((m, i) => (
					<ChatMessage key={i} message={m} />
				))}
			</div>
			<ChatInputField />
		</div>
	);
};

export default Chat;
