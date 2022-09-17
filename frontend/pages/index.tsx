import { RoomClientData } from "@common/types/models/room.model";
import { Home } from "@components";
import { NextPage } from "next";

interface Props {
	error: string;
}

// TODO display error
const App: NextPage<Props> = ({ error }) => {
	return <Home error={error} />;
};

export default App;
