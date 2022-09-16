import { IError } from "@common/types/errors";
import axios from "axios";
import settings from "settings.frontend";

export default async function checkPassword(roomId: string, password: string) {
	const { data } = await axios.get<{ ok: boolean; error?: IError }>(
		`${settings.socketServer}/checkPassword`,
		{
			headers: {
				Accept: "application/json",
			},
			timeout: 10000,
			params: {
				roomId,
                password
			},
		}
	);
	return data;
}
