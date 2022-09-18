import {
	adjectives,
	animals,
	Config,
	names,
	uniqueNamesGenerator,
} from "unique-names-generator";

const configAnim: Config = {
	dictionaries: [adjectives, animals],
	style: "capital",
	separator: "",
	length: 2,
};

const configNames: Config = {
	dictionaries: [adjectives, names],
	style: "capital",
	separator: "",
	length: 2,
};

export default function generateNickname() {
	return uniqueNamesGenerator(Math.random() > 0.5 ? configAnim : configNames);
}
