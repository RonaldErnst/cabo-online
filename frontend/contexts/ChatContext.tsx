import { IError } from "@common/types/errors";
import { ChatMessage } from "@common/types/models/chat.models";
import { ChatServerClientEvent, RoomServerClientEvent } from "@common/types/sockets";
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useLobby } from "./LobbyContext";
import { useSocket } from "./SocketContext";

interface IChatContext {
	messages: ChatMessage[];
	sendMessage: (message: string) => void;
}

const ChatContext = createContext<IChatContext | null>(null);

export function useChat() {
	const ctx = useContext(ChatContext);

	if (ctx === null) throw new Error("Chat Context not initialized yet");

	return ctx;
}

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
	const socket = useSocket();
    const { lobby } = useLobby();
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const errorListener = useCallback((err: IError) => {
		// TODO: display error as system message in chat
		if (err.type === "PlayerNotInRoomError") {
			setMessages((prevMessages) => {
				return [
					...prevMessages,
					{ text: err.message, isSystemMessage: true },
				];
			});
		}

		console.log(err);
	}, []);

	const chatEventListener = useCallback(
		(chatEvent: ChatServerClientEvent) => {
			switch (chatEvent.type) {
				case "MESSAGE":
					setMessages((prevMessages) => {
						return [...prevMessages, chatEvent.message];
					});
					break;
				default:
					// TODO: handle Error?
					console.log(`Unknown Chat Event`);
			}
		},
		[]
	);

    // TODO change room event needs a "change" attribute so it can displayed in chat (host, isprivate and maxplayernumber change)
    const roomEventListener = useCallback((roomEvent: RoomServerClientEvent) => {
        if(roomEvent.type !== "CHANGE_ROOM")
            return;

        
    }, []);

	useEffect(() => {
		socket.on("CHAT", chatEventListener);
		socket.on("ERROR", errorListener);

		return () => {
			socket.off("CHAT", chatEventListener);
			socket.off("ERROR", errorListener);
		};
	}, [chatEventListener, errorListener, socket]);

	const sendMessage = (message: string) => {
		socket.emit("CHAT", { type: "MESSAGE", message });
	};

	const value = {
		messages,
		sendMessage,
	};

	return (
		<ChatContext.Provider value={value}>{children}</ChatContext.Provider>
	);
};
