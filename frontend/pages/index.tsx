import { RoomClientData } from "@common/types/models/room.model";
import { CreateJoinRoom, NavBar, RoomList } from "@components";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import settings from "settings.frontend";

interface Props {
	rooms: RoomClientData[];
	error: string;
}

const Home: NextPage<Props> = ({ rooms, error }) => {
	return (
		<div className="bg-slate-600 w-full h-full flex flex-col">
			<NavBar />
			<div className="flex flex-row w-full h-full">
				<div className="grow flex justify-center items-center">
					<CreateJoinRoom error={error} />
				</div>
				<div className="w-80 h-full justify-center">
					<RoomList rooms={rooms} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{
	rooms: RoomClientData[];
}> = async (ctx) => {
	let rooms: RoomClientData[] = [];
	try {
		const { data } = await axios.get<RoomClientData[]>(
			`${settings.socketServer}/rooms`,
			{
				headers: {
					Accept: "application/json",
				},
				timeout: 10000,
			}
		);

		rooms = data;
	} catch (err) {
        // Something went wrong with the request
		console.log(err);
	}

	return {
		props: {
			rooms,
		},
	};
};

export default Home;
