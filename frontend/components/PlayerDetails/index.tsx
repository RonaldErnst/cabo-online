import { PlayerColorOptions } from "@common/types/utils";
import { useLobby } from "@contexts";
import { useDeferredValue, useEffect, useState } from "react";
import { CirclePicker, ColorChangeHandler } from "react-color";

const PlayerDetails = () => {
	const { player, changePlayerSetting } = useLobby();

	const [color, setColor] = useState<string | undefined>();
	const deferColor = useDeferredValue(color);

	const [nickname, setNickname] = useState<string | undefined>();
	const deferNickname = useDeferredValue(nickname);

	const [isReady, setIsReady] = useState<boolean | undefined>();
	const deferIsReady = useDeferredValue(isReady);

	useEffect(() => {
		if (player === undefined) return;

        setColor(player.color);
        setNickname(player.nickname);
        setIsReady(player.isReady);
	}, [player]);

	useEffect(() => {
		if (deferColor === undefined) return;

		changePlayerSetting({
			setting: "color",
			value: deferColor,
		});
	}, [changePlayerSetting, deferColor]);

	useEffect(() => {
		if (deferNickname === undefined) return;

		changePlayerSetting({
			setting: "nickname",
			value: deferNickname,
		});
	}, [changePlayerSetting, deferNickname, nickname]);

	useEffect(() => {
		if (deferIsReady === undefined) return;

		changePlayerSetting({
			setting: "isReady",
			value: deferIsReady,
		});
	}, [changePlayerSetting, deferIsReady, isReady]);

	const handleChangeColor: ColorChangeHandler = (color) => {
		setColor(color.hex);
	};

	return (
		<div
			className={`flex flex-col justify-center items-center ${
				player === undefined ? "pointer-events-none grayscale" : ""
			}`}
		>
			<CirclePicker
				colors={PlayerColorOptions}
				color={color}
				onChangeComplete={handleChangeColor}
			/>
		</div>
	);
};

export default PlayerDetails;
