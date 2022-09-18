import { RoomSettings } from "@common/types/models/room.model";
import { Lobby } from "@components";
import { GetServerSideProps } from "next";
import { FC } from "react";
import existsRoom from "utils/existsRoom";
import getDefaultRoomSettings from "utils/getDefaultRoomSettings";

interface Props {
	roomId: string;
	requiresPassword: boolean;
	password: string | null;
	defaultSettings: RoomSettings;
}

const RoomPage: FC<Props> = ({
	roomId,
	requiresPassword,
	password,
	defaultSettings,
}) => {
	const data = {
		roomId,
		requiresPassword,
		password,
		defaultSettings,
	};
	return <Lobby data={data} />;
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
		const defaultSettings = await getDefaultRoomSettings();

		// If room is public, let player join
		if (!room.isPrivate)
			return {
				props: {
					roomId: room.roomId,
					requiresPassword: false,
					password: null,
					defaultSettings,
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
					defaultSettings,
				},
			};

		return {
			props: {
				roomId: room.roomId,
				requiresPassword: true,
				password: Array.isArray(pw) ? pw[0] : pw,
				defaultSettings,
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
