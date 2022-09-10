import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import NavBar from "@components/NavBar";
import { RoomClientData } from "@common/types/models/room.model";

const Home: NextPage = ({rooms}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<div className="bg-slate-800 w-full h-full flex flex-col">
			<NavBar />
			<div className="flex flex-row w-full h-full">
				<div className="grow flex flex-col justify-center items-center bg-slate-400">
					Create Room Stuff
				</div>
				<div className="w-80 h-full justify-center"><div>Rooms</div></div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // TODO API Req to WS server and get information about all rooms
    const rooms: RoomClientData[] = [];

	return {
		props: {
			rooms,
		},
	};
};

export default Home;
