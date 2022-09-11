import { useSocket } from "@contexts/SocketContext";
import { GetServerSideProps } from "next";
import { FC } from "react";
import existsRoom from "utils/existsRoom";

interface Props {
    roomId: string;
}

const RoomPage: FC<Props> = ({ roomId }) => {
    const { socket } = useSocket();

    socket.once("JOIN_ROOM", (playerId, room) => {
        console.log(playerId, room);
    });
    socket.emit("JOIN_ROOM", roomId);

	return <div>Enter</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
		const room = await existsRoom(Array.isArray(roomId) ? roomId[0] : roomId);

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

		return {
			props: {
				roomId: room.roomId,
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
