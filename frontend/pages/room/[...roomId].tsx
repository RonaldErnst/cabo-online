import { Lobby } from "@components";
import { GetServerSideProps } from "next";
import { FC } from "react";
import existsRoom from "utils/existsRoom";

interface Props {
	roomId: string;
	requiresPassword: boolean;
	password: string | null;
}

const RoomPage: FC<Props> = ({ roomId, requiresPassword, password }) => {
    return <Lobby roomId={roomId} requiresPassword={requiresPassword} password={password} />;
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
		if (room === null)
			return {
				redirect: {
					permanent: false,
					destination: "/",
				},
				props: {
					error: "Room does not exist",
				},
			};

		// Room exists, check for password

		// If room is public, let
		if (!room.isPrivate)
			return {
				props: {
					roomId: room.roomId,
					requiresPassword: false,
					password: null,
				},
			};

		// Room requires password, check if password passed as parameter
		// No password given, prompt password
		const { pw } = query;

		if (pw === undefined)
			return {
				props: {
					roomId: room.roomId,
					requiresPassword: true,
					password: null,
				},
			};

		return {
			props: {
				roomId: room.roomId,
				requiresPassword: true,
				password: Array.isArray(pw) ? pw[0] : pw,
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
