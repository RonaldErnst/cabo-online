import { ChatMessage } from "@common/types/models/chat.models";
import { useLobby } from "@contexts";
import { useSocket } from "@contexts/SocketContext";
import { FC } from "react";

interface Props {
	message: ChatMessage;
}

const ChatMessage: FC<Props> = ({ message }) => {

	if (message.isSystemMessage) return <SystemMessage text={message.text} />;

	return (
		<PlayerMessage
            playerId={message.playerId}
			text={message.text}
		/>
	);
};

const SystemMessage: FC<{ text: string }> = ({ text }) => {
	return <div className="">{text}</div>;
};

const PlayerMessage: FC<{
    playerId: string
	text: string;
}> = ({ playerId, text }) => {
	const socket = useSocket();
    const { getPlayer } = useLobby();
    const player = getPlayer(playerId);

    if(player === undefined)
        return null;

    const isAuthor = player.playerId === socket.id;
    const color = player.color;
    const nickname = player.nickname;

    console.log(color);

	return (
		<div
			className={`justify-self-end max-w-fit relative rounded-lg ${
				isAuthor
					? `justify-self-end bg-blue-400`
					: `justify-self-start bg-slate-300`
			}`}
		>
			<div className={`h-0 px-4 py-1 mb-1 text-sm text-[${color}]`}>
				{nickname}
			</div>
			<p
				className={`w-full px-2 pt-2 pb-1 break-words`}
			>
				{text}
			</p>
		</div>
	);
};

export default ChatMessage;
