import { useRooms } from "@contexts/RoomsContext";
import { FC } from "react";
import Room from "./Room";

const RoomList: FC = () => {
	const rooms = useRooms();

	return (
		<div className="flex flex-col m-4 text-center text-lg">
			{rooms.length === 0 ? (
				<div>No available rooms</div>
			) : (
				<table>
					<thead>
						<tr>
							<th className="w-40">Room</th>
							<th className="w-24">Players</th>
							<th className="w-16">Public</th>
							<th className="w-24"></th>
						</tr>
					</thead>
					<tbody>
						{rooms.map((room) => {
							return <Room key={room.roomId} room={room} />;
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default RoomList;
