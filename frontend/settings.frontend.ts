import userSettings from "../settings.json";
import { env } from "process";

export type FrontendSettings = {
  wsPort: number;
  socketServer: string;
} & typeof userSettings.frontend

export function getSocketServerHost() {
    switch(process.env.NODE_ENV) {
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
  wsPort: userSettings.backend.port,
  socketServer: getSocketServerHost()
};

export default settings;
