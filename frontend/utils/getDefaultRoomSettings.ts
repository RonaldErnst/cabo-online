import { RoomSettings } from "@common/types/models/room.model";
import axios from "axios";
import settings from "settings.frontend";

export default async function getDefaultRoomSettings() {
    const { data } = await axios.get<RoomSettings>(
		`${settings.socketServer}/getDefaultSettings`,
		{
			headers: {
				Accept: "application/json",
			},
			timeout: 10000,
		}
	);
	return data;
}