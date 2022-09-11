import { RoomClientData } from "@common/types/models/room.model";
import { FC } from "react";

interface Props {
	rooms: RoomClientData[];
}

const RoomList: FC<Props> = ({ rooms }) => {
	return (
		<div className="w-full h-full flex flex-col">
			{rooms.length == 0? 
                (
                    <div>No available rooms</div>
                ): 
                rooms.map((room) => {
                    return <div key={room.roomId}>{room.roomId}</div>;
                })
            }
		</div>
	);
};

export default RoomList;
