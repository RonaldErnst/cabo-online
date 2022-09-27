import { env } from "process";
import userSettings from "../settings.json";

export type FrontendSettings = {
	wsPort: number;
	socketServer: string;
} & typeof userSettings.frontend &
	typeof userSettings.common;

export function getSocketServerHost() {
	switch (process.env.NODE_ENV) {
		case "test":
		case "production":
			return `${env.SOCKET_HOST}:${userSettings.backend.port}`;
		case "development":
		default:
			return `http://localhost:${userSettings.backend.port}`;
	}
}

const settings: FrontendSettings = {
	...userSettings.frontend,
    ...userSettings.common,
	wsPort: userSettings.backend.port,
	socketServer: getSocketServerHost(),
};

export default settings;
