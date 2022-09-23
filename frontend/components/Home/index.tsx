import PlayerDetails from "@components/PlayerDetails";
import { FC } from "react";
import CreateJoinRoom from "./CreateJoinRoom";
import NavBar from "./NavBar";
import RoomList from "./RoomList";

interface Props {
	error: string;
}

const Home: FC<Props> = ({ error }) => {
	return (
		<div className="bg-slate-700 w-full h-full flex flex-col">
			<NavBar />
			<div className="flex flex-row w-full h-full">
				<div className="m-auto flex flex-row gap-x-16 justify-center items-center bg-slate-600 p-16 rounded-xl drop-shadow-lg">
					<CreateJoinRoom />
				</div>
				<RoomList />
			</div>
		</div>
	);
};

export default Home;
