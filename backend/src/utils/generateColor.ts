import  { PlayerColorOptions } from "@common/types/utils";

export default function generateColor() {
    const index = Math.floor(Math.random() * PlayerColorOptions.length);
    return PlayerColorOptions[index];
}