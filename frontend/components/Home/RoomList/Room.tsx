import { RoomClientData } from "@common/types/models/room.model";
import axios from "axios";
import { useRouter } from "next/router";
import { FC } from "react";
import { LockFill, Unlock } from "react-bootstrap-icons";
import existsRoom from "utils/existsRoom";


const Room: FC<{ room: RoomClientData, index: number }> = ({ room, index }) => {
    const router = useRouter();

    const handleJoinRoom = async (
		roomId: string
	) => {
		try {
            if(room.players.length >= room.maxPlayerCount) {
                // TODO show error
                return;
            }

			// Room exists, join room
			router.push(`/room/${roomId}`);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.log("error message: ", err.message);
                // TODO show error
			} else {
				console.log("unexpected error: ", err);
                // TODO show error
			}
		}
	};

	return (
		<tr className={`h-12 ${index % 2 === 0? "bg-slate-600" : ""}`}>
			<td>{room.roomId}</td>
			<td>
				{room.players.length} / {room.maxPlayerCount}
			</td>
			<td>
				{room.isPrivate ? (
					<LockFill className="mx-auto" />
				) : (
					<Unlock className="mx-auto" />
				)}
			</td>
			<td>
				<button onClick={() => handleJoinRoom(room.roomId)} className="bg-orange-500 py-1 px-6 rounded-lg transition active:scale-95 hover:bg-orange-400">
					Join
				</button>
			</td>
		</tr>
	);
};

export default Room;