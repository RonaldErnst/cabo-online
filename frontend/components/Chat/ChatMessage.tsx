import { ChatMessage } from "@common/types/models/chat.models";
import { useSocket } from "@contexts/SocketContext";
import { FC } from "react";

interface Props {
	message: ChatMessage;
}

const ChatMessage: FC<Props> = ({ message }) => {
	const socket = useSocket();

	if (message.isSystemMessage) return <SystemMessage text={message.text} />;

	return (
		<PlayerMessage
			isAuthor={message.player.playerId === socket.id}
			nickname={message.player.nickname}
			text={message.text}
		/>
	);
};

const SystemMessage: FC<{ text: string }> = ({ text }) => {
	return <div className="">{text}</div>;
};

const PlayerMessage: FC<{
	isAuthor: boolean;
	nickname: string;
	text: string;
}> = ({ isAuthor, nickname, text }) => {
	return (
		<div
			className={`justify-self-end max-w-fit relative ${
				isAuthor
					? `justify-self-end bg-blue-400`
					: `justify-self-start bg-slate-300`
			}`}
		>
			<div className="h-0 px-4 py-1 mb-1 text-sm">
				{nickname}
				{/* TODO: add color to names */}
			</div>
			<p
				className={`w-full px-2 pt-2 pb-1 rounded-lg bg-slate-300 break-words`}
			>
				{text}
			</p>
		</div>
	);
};

export default ChatMessage;
