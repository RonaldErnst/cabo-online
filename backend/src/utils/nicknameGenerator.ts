import { Config, uniqueNamesGenerator, adjectives, colors, names, animals  } from "unique-names-generator";

const config: Config = {
    dictionaries: [adjectives, colors, animals],
    length: 3
}

export default function generateNickname() {
    return uniqueNamesGenerator(config);
}