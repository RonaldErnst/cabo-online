import userSettings from "../../settings.json";

const settings = { ...userSettings.backend, ...userSettings.common };
export default settings;
