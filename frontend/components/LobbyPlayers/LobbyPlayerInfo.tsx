import { PlayerClientData } from "@common/types/models/player.model";
import { FC } from "react";

interface Props {
	player: PlayerClientData;
}

const LobbyPlayerInfo: FC<Props> = ({ player }) => {
	const { nickname, isReady, color } = player;
    
    return <div className="flex flex-col gap-y-4 justify-center items-center bg-slate-800 rounded-lg drop-shadow-lg p-4 font-bold">
        <div className={`text-[${color}]`}>{nickname}</div>
        <div className={`${isReady? "text-green-500" : "text-red-500"}`}>{isReady? "Ready" : "Not ready"}</div>
    </div>;
};

export default LobbyPlayerInfo;
