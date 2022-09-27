import { IError } from "@common/types/errors";
import { RoomSettings } from "@common/types/models/room.model";
import { Lobby } from "@components";
import PasswordPrompt from "@components/PasswordPrompt";
import { ChatProvider, LobbyProvider, useSocket } from "@contexts";
import { GetServerSideProps } from "next";
import { FC, useEffect } from "react";
import checkPassword from "utils/checkPassword";
import existsRoom from "utils/existsRoom";
import getDefaultRoomSettings from "utils/getDefaultRoomSettings";

interface Props {
	roomId: string;
	requiresPassword: boolean;
	password: string | null;
	defaultRoomSettings: RoomSettings;
}

const RoomPage: FC<Props> = ({
	roomId,
	requiresPassword,
	password,
	defaultRoomSettings,
}) => {
	const socket = useSocket();

	useEffect(() => {
		// If room requires password and no pw given, do nothing, prompt pw
		if (requiresPassword && password === null) return;

		const errorListener = (err: IError) => {
			console.log(err);
			socket.off("ERROR", errorListener);
		};

		socket.once("ERROR", errorListener);

		// Join the room. Either no pw required (pw=null) or pw already given
		// TODO: nickname erstellung und color vergabe auf Serverseite anstatt von Client aus
		socket.emit("ROOM", { type: "JOIN_ROOM", roomId, password });

		return () => {
			// If room requires password and no pw given, do nothing, prompt pw
			if (requiresPassword && password === null) return;

			const errorListener = (err: IError) => {
				console.log(err); // TODO handle Error
				socket.off("ERROR", errorListener);
			};

			socket.once("ERROR", errorListener);

			// Only leave if player has joined the room
			socket.emit("ROOM", { type: "LEAVE_ROOM" });
		};
	}, [password, requiresPassword, roomId, socket]);

	if (requiresPassword && password === null)
		return <PasswordPrompt roomId={roomId} />;

	return (
		<LobbyProvider
			defaultRoomSettings={defaultRoomSettings}
			roomId={roomId}
            password={password}
		>
			<ChatProvider>
				<Lobby />
			</ChatProvider>
		</LobbyProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	params,
	query,
}) => {
	// If roomId undefined, redirect to home page
	if (params === undefined || params.roomId === undefined)
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {
				error: "No Room ID given",
			},
		};

	let { roomId } = params;

	try {
		const room = await existsRoom(
			Array.isArray(roomId) ? roomId[0] : roomId
		);

		// Room doesn't exist, redirect to home page
		if (room === null) {
			return {
				redirect: {
					permanent: false,
					destination: "/",
				},
				props: {
					error: "Room does not exist",
				},
			};
		}

		// Room exists, get default room settings
		const defaultRoomSettings = await getDefaultRoomSettings();

		// If room is public, let player join
		if (!room.isPrivate)
			return {
				props: {
					roomId: room.roomId,
					requiresPassword: false,
					password: null,
					defaultRoomSettings,
				},
			};

		// Room requires password, check if password passed as parameter
		// No password given, prompt the password
		const { pw } = query;

		if (pw === undefined)
			return {
				props: {
					roomId: room.roomId,
					requiresPassword: true,
					password: null,
				},
			};

        const { ok } = await checkPassword(room.roomId, Array.isArray(pw) ? pw[0] : pw);

        // Wrong password in parameter, prompt new password
        if(!ok)
            return {
                props: {
					roomId: room.roomId,
					requiresPassword: true,
					password: null,
				},
            }

		return {
			props: {
				roomId: room.roomId,
				requiresPassword: true,
				password: Array.isArray(pw) ? pw[0] : pw,
				defaultRoomSettings,
			},
		};
	} catch (err) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {
				error: "Unexpected error",
			},
		};
	}
};

export default RoomPage;
