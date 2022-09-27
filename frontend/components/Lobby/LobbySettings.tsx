import { useLobby } from "@contexts";
import { ChangeEventHandler, FC, useEffect, useState } from "react";
import settings from "settings.frontend";
import rangeArray from "utils/rangeArray";
import * as Yup from "yup";

type IPrivateValues =
	| {
			isPrivate: true;
			password: string;
	  }
	| {
			isPrivate: false;
			password: null;
	  };

const passwordSchema = Yup.string()
	.nullable()
	.trim()
	.required("Cannot be empty")
	.min(5, "Must be at least 5 characters")
	.max(25, "Must be at most 25 characters")
	.matches(/^[\w]*$/, "Only allowed characters: letters, numbers and _");

const validatePassword = (password: string | null) => {
	return passwordSchema.validate(password);
};

const LobbySettings: FC = () => {
	const { lobby, changeRoomSetting, password: initialPassword } = useLobby();
	const maxPlayerNumberOptions = rangeArray(
		2,
		settings.maxPlayerNumberOption
	);

	const loading = lobby === undefined;

	const [isPrivate, setIsPrivate] = useState<boolean | undefined>();
	const [password, setPassword] = useState<string | null>(initialPassword);
	const [passError, setPassError] = useState<string | null>(null);
	const [maxPlayerCount, setMaxPlayerCount] = useState<number | undefined>();

	useEffect(() => {
		if (lobby === undefined) return;

		setIsPrivate(lobby.isPrivate);
		setMaxPlayerCount(lobby.maxPlayerCount);
	}, [lobby]);

	const handelPrivatePassword = (privateValues: IPrivateValues) => {
		if (isPrivate && password === null) return;

		if (!isPrivate) {
			setPassword(null);
		}

		changeRoomSetting({
			setting: "isPrivate",
			value: privateValues,
		});
	};

	const handleSetIsPrivate: ChangeEventHandler<HTMLInputElement> = (e) => {
		setPassError(null);

		const value = e.target.checked;
		setIsPrivate(value);

		if (!value) {
			setPassword(null);
			handelPrivatePassword({ isPrivate: false, password: null });
			return;
		}
		validatePassword(password)
			.then((pw) => {
				handelPrivatePassword({ isPrivate: true, password: pw });
			})
			.catch((err: Yup.ValidationError) => {
				setPassError(err.message);
			});
	};

	const handleSetPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
		setPassError(null);

		if (!isPrivate) return;

		const value = e.target.value.trim();
		setPassword(value);
		validatePassword(value)
			.then((pw) => {
				handelPrivatePassword({ isPrivate: true, password: pw });
			})
			.catch((err: Yup.ValidationError) => {
				setPassError(err.message);
			});
	};

	const handleSetMaxPlayerCount: ChangeEventHandler<HTMLSelectElement> = (
		e
	) => {
		e.preventDefault();
		const value = parseInt(e.target.value);
		setMaxPlayerCount(value);

		changeRoomSetting({ setting: "maxPlayerCount", value });
	};

	return (
		<div
			className={`text-white ${
				loading ? "pointer-events-none grayscale" : ""
			} grid place-content-center gap-y-8 bg-slate-600 p-16 rounded-xl drop-shadow-lg`}
		>
			<div>
				<label
					htmlFor="maxPlayerCount"
					className="block mb-2 text-sm font-medium text-gray-300"
				>
					Maximum player count
				</label>
				<select
					id="maxPlayerCount"
					value={
						maxPlayerCount === undefined
							? settings.maxPlayerNumberOption
							: maxPlayerCount
					}
					onChange={handleSetMaxPlayerCount}
					className="block w-full p-2 bg-slate-800 drop-shadow-lg rounded-lg focus:ring-blue-500 focus:border-blue-500"
				>
					{maxPlayerNumberOptions.map((o) => (
						<option value={o} key={o}>
							{o}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col gap-y-2">
				<div className="flex items-center gap-x-2">
					<input
						id="isPrivate"
						type="checkbox"
						checked={isPrivate === undefined ? false : isPrivate}
						onChange={handleSetIsPrivate}
						className="w-5 h-5"
					/>
					<label
						htmlFor="isPrivate"
						className="block text-sm font-medium text-gray-300"
					>
						Private Room
					</label>
				</div>
				<div
					className={`transition-all ${
						isPrivate ? "h-fit" : "h-0 hidden"
					}`}
				>
					<label
						htmlFor="password"
						className="block place-self-start text-sm font-medium text-gray-300"
					>
						Password
					</label>
					{passError === null ? null : (
						<div className="text-sm text-red-500 font-semibold drop-shadow-md shadow-red-500">
							{passError}
						</div>
					)}
					<input
						id="password"
						name="password"
						placeholder="Enter room password"
						type="text"
						value={password === null ? "" : password}
						onChange={handleSetPassword}
						className={`w-80 h-12 p-2 rounded-md bg-slate-800 ${
							passError !== null
								? "outline-none focus:ring-2 focus:ring-red-500 shadow-md shadow-red-500"
								: ""
						}`}
					/>
				</div>
			</div>
            {/* TODO start game button */}
		</div>
	);
};

export default LobbySettings;
