import { RoomClientData } from "@common/types/models/room.model";
import axios from "axios";
import settings from "settings.frontend";

export default async function existsRoom(roomId: string) {
	const { data } = await axios.get<RoomClientData | null>(
		`${settings.socketServer}/room`,
		{
			headers: {
				Accept: "application/json",
			},
			timeout: 10000,
			params: {
				roomId,
			},
		}
	);
	return data;
}
