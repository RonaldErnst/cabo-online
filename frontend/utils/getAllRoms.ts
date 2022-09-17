import { RoomClientData } from "@common/types/models/room.model";
import axios from "axios";
import settings from "settings.frontend";

export default async function getAllRooms() {
	try {
		const { data: rooms } = await axios.get<RoomClientData[]>(
			`${settings.socketServer}/rooms`,
			{
				headers: {
					Accept: "application/json",
				},
				timeout: 10000,
			}
		);

		return rooms;
	} catch (err) {
        // Something went wrong with the request
		console.error(err);
        return [];
	}
}