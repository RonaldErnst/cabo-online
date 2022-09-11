import React, { useState } from "react";

type Props = {
	error: string;
	clearError: Function;
};

const ErrorAlert = ({ error, clearError }: Props) => {
	return (
		<div
			id="error-alert"
			className="flex items-center p-2 bg-red-100 text-red-500 rounded-lg"
			role="alert"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				className="stroke-red-500 flex-shrink-0 w-6 h-6"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<div className="grow ml-3 font-medium">{error}</div>
			<button
				className="rounded-lg p-1 hover:bg-red-200 h-8 w-8"
				onClick={() => clearError()}
			>
				<svg
					className="m-auto w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
				</svg>
			</button>
		</div>
	);
};

export default ErrorAlert;
