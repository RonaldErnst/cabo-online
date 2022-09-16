import { RoomClientData } from "@common/types/models/room.model";
import { Home } from "@components";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import settings from "settings.frontend";

interface Props {
	rooms: RoomClientData[];
	error: string;
}

// TODO display error
const App: NextPage<Props> = ({ rooms, error }) => {
	return <Home rooms={rooms} error={error}/>;
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
		console.error(err);
	}

	return {
		props: {
			rooms,
		},
	};
};

export default App;
