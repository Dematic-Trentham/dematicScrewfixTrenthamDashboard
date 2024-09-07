"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { toast } from "react-toastify";

import { requestNewJourneyToDB } from "../_actions/requestNewJourney";
interface RequestNewJourneyProps {}

const RequestNewJourney: React.FC<RequestNewJourneyProps> = (props) => {
	const [isDirty, setIsDirty] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addRequest = () => {
		setError(null);

		//screwfix uses a 8 digit number
		const ul = document.getElementById("requestUL") as HTMLInputElement;

		if (!ul || ul.value.length !== 8) {
			setError("Please enter a valid UL");
			console.log("Please enter a valid UL");

			return;
		}

		toast.info("Request added for UL: " + ul.value);

		requestNewJourneyToDB(ul.value).catch((error) => {
			setError(error.message);
		});

		//reset the form
		ul.value = "";
		setIsDirty(false);
		console.log("Request added");
	};

	return (
		<>
			{error && (
				<div className="flex items-center space-x-2 align-middle text-red-500">
					<BiErrorCircle />
					<div>{error}</div>
				</div>
			)}

			<div className="flex w-full items-center justify-center space-x-1">
				<Input
					id="requestUL"
					label="Ul To Request"
					name="requestUL"
					placeholder="Enter a Ul To Search"
					type="text"
					onChange={() => setIsDirty(true)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							addRequest();
						}
					}}
				/>

				<Button
					color={!isDirty ? "default" : "primary"}
					disabled={!isDirty}
					onClick={addRequest}
				>
					Make Request
				</Button>
			</div>
		</>
	);
};

export default RequestNewJourney;
