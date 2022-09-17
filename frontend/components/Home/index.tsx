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
				<CreateJoinRoom />
				<RoomList />
			</div>
		</div>
	);
};

export default Home;
