import userSettings from "../settings.json";

export interface FrontendSettings {
  wsPort: number;
}

const settings: FrontendSettings = {
  ...userSettings.frontend,
  wsPort: userSettings.backend.port,
};

export default settings;
