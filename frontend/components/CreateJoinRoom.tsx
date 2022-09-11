import { IError } from "@common/types/errors";
import { RoomClientData } from "@common/types/models/room.model";
import { useSocket } from "@contexts/SocketContext";
import axios from "axios";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { FC, useRef } from "react";
import existsRoom from "utils/existsRoom";
import * as Yup from "yup";
import ErrorAlert from "./ErrorAlert";

interface Props {
    error: string;
}

interface FormValues {
	roomId: string;
	shouldCreateRoom: boolean;
}

const CreateJoinRoom: FC<Props> = ({ error }) => {
	const { socket } = useSocket();
	const inputRef = useRef<HTMLElement>(null);
	const router = useRouter();

	const initialValues: FormValues = {
		roomId: "",
		shouldCreateRoom: false,
	};

	const validationSchema = Yup.object({
		roomId: Yup.string()
			.trim()
			.required("Cannot be empty")
			.min(5, "Must be at least 5 characters long")
			.max(20, "Must be at most 20 characters long"),
	});

	// Create listeners for one time responses
	const handleCreateRoom = (
		roomId: string,
		{ setFieldError }: FormikHelpers<FormValues>
	) => {
		const errorListener = (err: IError) => {
			removeListeners();

			console.log(err);
			setFieldError("roomId", err.message);
			inputRef.current?.focus();
		};

		const createRoomListener = (room: RoomClientData) => {
			removeListeners();

			// Room got created, join room
			router.push(`/room/${room.roomId}`);
		};

		const removeListeners = () => {
			socket.off("ERROR", errorListener);
			socket.off("CREATE_ROOM", createRoomListener);
		};

		socket.once("ERROR", errorListener);
		socket.once("CREATE_ROOM", createRoomListener);
		socket.emit("CREATE_ROOM", roomId);
	};

	const handleJoinRoom = async (
		roomId: string,
		{ setFieldError }: FormikHelpers<FormValues>
	) => {
		try {
			// Check if room exists
			const room = await existsRoom(roomId);

			// If room doesn't exist, show Error
			if (room === null) {
				setFieldError("roomId", "Room does not exist");
				return;
			}

            if(room.currPlayerCount >= room.maxPlayerCount) {
                setFieldError("roomId", "Room already full");
                return;
            }

			// Room exists, join room
			router.push(`/room/${roomId}`);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.log("error message: ", err.message);
				setFieldError("roomId", err.message);
			} else {
				console.log("unexpected error: ", err);
				setFieldError("roomId", "An unexpected error occurred");
			}
		}
	};

	async function handleSubmit(
		{ roomId, shouldCreateRoom }: FormValues,
		actions: FormikHelpers<FormValues>
	) {
		if (shouldCreateRoom) {
			handleCreateRoom(roomId, actions);
		} else {
			handleJoinRoom(roomId, actions);
		}

		actions.setSubmitting(false);
	}
    

	return (
		<Formik<FormValues>
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
			validateOnBlur={false}
			validateOnChange={false}
		>
			{({
				setFieldValue,
				handleSubmit,
				isSubmitting,
				errors,
				setFieldError,
			}) => (
				<Form className="flex flex-col items-center gap-4">
					{errors.roomId ? (
						<ErrorAlert
							error={errors.roomId}
							clearError={() =>
								setFieldError("roomId", undefined)
							}
						/>
					) : null}
					<Field
						innerRef={inputRef}
						name="roomId"
						placeholder="Join or create a new room..."
						className="w-80 h-12 p-2 rounded-md text-xl"
					/>
					<div className="flex flex-row gap-12 justify-center text-lg">
						<button
							className="bg-orange-500 py-2 px-4 rounded-lg transition active:scale-95 hover:bg-orange-400 disabled:bg-slate-5"
							disabled={isSubmitting}
							type="submit"
							onClick={(e) => {
								e.preventDefault();
								setFieldValue("shouldCreateRoom", true);
								handleSubmit();
								inputRef.current?.focus();
							}}
						>
							Create Room
						</button>
						<button
							className="bg-orange-500 py-2 px-4 rounded-lg transition active:scale-95 hover:bg-orange-400 disabled:bg-slate-500"
							disabled={isSubmitting}
							type="submit"
							onClick={(e) => {
								e.preventDefault();
								setFieldValue("shouldCreateRoom", false);
								handleSubmit();
								inputRef.current?.focus();
							}}
						>
							Join Room
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default CreateJoinRoom;
