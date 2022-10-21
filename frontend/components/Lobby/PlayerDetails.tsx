import { PlayerColorOptions } from "@common/types/utils";
import { useLobby } from "@contexts";
import {
	ChangeEventHandler,
	MouseEventHandler,
	useEffect,
	useState,
} from "react";
import { Check, X } from "react-bootstrap-icons";
import { CirclePicker, ColorChangeHandler } from "react-color";
import * as Yup from "yup";

const nicknameSchema = Yup.string()
	.trim()
	.required("Cannot be empty")
	.min(5, "Must be at least 5 characters")
	.max(25, "Must be at most 25 characters")
	.matches(
		/^[\w\s-]*$/,
		"Only allowed characters: letters, numbers, whitespace, - and _"
	);

const validateNickname = (nickname: string) => {
	return nicknameSchema.validate(nickname);
};

const PlayerDetails = () => {
	const { player, changePlayerSetting } = useLobby();

	const [nickname, setNickname] = useState<string>("");
	const [nickError, setNickError] = useState<string | null>(null);
	const [color, setColor] = useState<string | undefined>();
	const [isReady, setIsReady] = useState<boolean | undefined>();
	const loading = player === undefined;

	useEffect(() => {
		if (player === undefined) return;

		setNickname(player.nickname);
		setColor(player.color);
		setIsReady(player.isReady);
	}, [player]);

	const handleChangeColor: ColorChangeHandler = (color) => {
		setColor(color.hex);
		changePlayerSetting({
			setting: "color",
			value: color.hex,
		});
	};

	const handleChangeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();
		setNickname(e.target.value);
		setNickError(null);

		validateNickname(e.target.value)
			.then((nn) => {
				changePlayerSetting({
					setting: "nickname",
					value: nn,
				});
			})
			.catch((err: Yup.ValidationError) => {
				setNickError(err.message);
			});
	};

	const handleChangeIsReady: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		setIsReady(!isReady);
		changePlayerSetting({
			setting: "isReady",
			value: !isReady,
		});
	};

	return (
		<div
			className={`text-xl text-white grid place-content-center ${
				loading ? "pointer-events-none grayscale" : ""
			}`}
		>
			<div className="flex flex-col justify-center items-center gap-y-8 bg-slate-600 p-16 rounded-xl drop-shadow-lg">
				<div className="flex flex-row justify-center items-center gap-x-12 ">
					<div className="grid place-content-center gap-y-2">
						<label
							htmlFor="nickname"
							className="block place-self-start text-sm font-medium text-gray-300"
						>
							Nickname
						</label>
						{nickError === null ? null : (
							<div className="text-sm text-red-500 font-semibold drop-shadow-md shadow-red-500">
								{nickError}
							</div>
						)}
						<input
							id="nickname"
							name="nickname"
							placeholder="Enter your nickname"
							type="text"
							value={loading ? "" : nickname}
							onChange={handleChangeNickname}
							className={`w-80 h-12 p-2 rounded-md bg-slate-800 ${
								nickError !== null ? "outline-none focus:ring-2 focus:ring-red-500 shadow-md shadow-red-500" : ""
							}`}
						/>
					</div>
					<div className="p-8 bg-slate-800 rounded-xl drop-shadow-lg">
						<CirclePicker
							colors={PlayerColorOptions}
							color={loading ? undefined : color}
							onChangeComplete={handleChangeColor}
						/>
					</div>
				</div>
				<button
					className={`px-4 py-2 rounded-lg text-xl font-bold flex flex-row items-center ${
						isReady ? "bg-red-600" : "bg-green-600"
					}`}
					onClick={handleChangeIsReady}
				>
					{isReady ? (
						<X className="w-8 h-8" />
					) : (
						<Check className="w-8 h-8" />
					)}
					<span>{isReady ? "Unready" : "Ready"}</span>
				</button>
			</div>
		</div>
	);
};

export default PlayerDetails;
