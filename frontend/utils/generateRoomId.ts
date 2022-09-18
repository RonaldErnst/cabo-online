import {
	adjectives,
	animals,
	colors,
	Config,
	uniqueNamesGenerator,
} from "unique-names-generator";

const config: Config = {
	dictionaries: [adjectives, colors, animals],
	style: "capital",
	separator: "",
	length: 3,
};

export default function generateRoomId() {
	return uniqueNamesGenerator(config);
}
