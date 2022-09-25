import { PlayerClientData } from "@common/types/models/player.model";
import { FC } from "react";

interface Props {
	player: PlayerClientData;
}

const LobbyPlayerInfo: FC<Props> = ({ player }) => {
	const { nickname, isReady, color } = player;
    
    return <div className={`text-[${color}]`}>{nickname}<br />{isReady? "Ready" : "Not ready"}</div>;
};

export default LobbyPlayerInfo;
