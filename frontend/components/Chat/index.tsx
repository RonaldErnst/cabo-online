import { useChat } from "@contexts/ChatContext";
import { useEffect, useRef } from "react";
import ChatInputField from "./ChatInputField";
import ChatMessage from "./ChatMessage";

const Chat = () => {
	const { messages } = useChat();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages]);
    
	return (
		<div className="w-96 flex flex-col gap-4 p-4 bg-slate-600">
			<div className="grow w-full flex flex-col flex-nowrap gap-y-2 overflow-y-auto">
				{messages.map((m, i) => (
					<ChatMessage key={i} message={m} />
				))}
                <div ref={messagesEndRef}></div>
			</div>
			<ChatInputField />
		</div>
	);
};

export default Chat;
