import { RoomClientData } from "@common/types/models/room.model";
import { PlayerProvider, RoomsProvider, SocketProvider } from "@contexts";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import App from "next/app";
import getAllRooms from "utils/getAllRoms";
import "../styles/globals.css";

type Props = { initialRooms: RoomClientData[] };

function MyApp({ Component, pageProps, initialRooms }: AppProps & Props) {
	return (
		<SocketProvider>
			<PlayerProvider>
				<RoomsProvider initialRooms={initialRooms}>
					<Component {...pageProps} />
				</RoomsProvider>
			</PlayerProvider>
		</SocketProvider>
	);
}

MyApp.getInitialProps = async (
	context: AppContext
): Promise<Props & AppInitialProps> => {
	const ctx = await App.getInitialProps(context);

	const initialRooms = await getAllRooms();

	return { ...ctx, initialRooms };
};

export default MyApp;
