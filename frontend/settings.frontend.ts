import userSettings from "../settings.json";

export interface FrontendSettings {
  wsPort: number;
  socketServer: string;
}

const settings: FrontendSettings = {
  ...userSettings.frontend,
  wsPort: userSettings.backend.port,
  socketServer: `http://localhost:${userSettings.backend.port}` //`http://192.168.178.37:${userSettings.backend.port}`
};

export default settings;
