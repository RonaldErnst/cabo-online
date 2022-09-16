import { RoomClientData } from "@common/types/models/room.model";
import { FC } from "react";
import CreateJoinRoom from "./CreateJoinRoom";
import NavBar from "./NavBar";
import RoomList from "./RoomList";

interface Props {
	rooms: RoomClientData[];
	error: string;
}

const Home: FC<Props> = ({ rooms, error }) => {
	return (
		<div className="bg-slate-700 w-full h-full flex flex-col">
			<NavBar />
			<div className="flex flex-row w-full h-full">
				<CreateJoinRoom />
				<RoomList rooms={rooms} />
			</div>
		</div>
	);
};

export default Home;
