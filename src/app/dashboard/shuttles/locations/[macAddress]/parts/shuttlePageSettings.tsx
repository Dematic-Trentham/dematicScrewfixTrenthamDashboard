import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";

import { getShuttleFromMac, updateShuttleId } from "./_actions";

import { hasPermission } from "@/utils/getUser";

interface ShuttlePageSettingsProps {
	macAddress: string;
}

const ShuttlePageSettings: React.FC<ShuttlePageSettingsProps> = (props) => {
	const [permission, setPermission] = useState(false);

	const [shuttleID, setShuttleID] = useState<string | null>("");
	const [newShuttleID, setNewShuttleID] = useState<string | null>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isDirty, setIsDirty] = useState(false);

	useEffect(() => {
		const fetchShuttle = async () => {
			const shuttle = await getShuttleFromMac(props.macAddress);

			if (!shuttle) {
				setIsLoading(false);
				setError("Failed to fetch shuttle details");

				return;
			}

			setShuttleID(shuttle.shuttleID || "Unknown");
			setNewShuttleID(shuttle.shuttleID || "Unknown");
			setIsLoading(false);

			console.log(shuttle);
			setError(null);
		};
		const fetchUserPemission = async () => {
			setPermission(await hasPermission("shuttleEdit"));
		};

		fetchShuttle();
		fetchUserPemission();
	}, []);

	const handleShuttleIdChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newShuttleId = event.target.value;

		setNewShuttleID(newShuttleId);
		setIsDirty(newShuttleId !== shuttleID);
	};

	const handleSave = () => {
		if (!newShuttleID) {
			setError("Shuttle ID cannot be empty");

			return;
		}

		const error = updateShuttleId(props.macAddress, newShuttleID);

		setNewShuttleID(newShuttleID);
		setIsDirty(false);

		toast.success("Shuttle ID updated successfully");

		//refresh the page
		setCookie("reloadNeeded", "true");
	};

	if (isLoading) {
		return <div>is loading....</div>;
	}

	if (error) {
		return <div className="text-red-600">{error}</div>;
	}

	if (!permission) {
		return (
			<div>
				<div className="text-xl font-bold">Permission Denied</div>
				<div>
					You require the &quot;shuttleEdit&quot;. permission Please ask admin
					to grant access.
				</div>
			</div>
		);
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<Input
				defaultValue={shuttleID || ""}
				id="shuttleID"
				label="Shuttle ID"
				name="shuttleID"
				placeholder="Enter a Shuttle ID"
				type="text"
				onChange={handleShuttleIdChange}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						handleSave();
					}
				}}
			/>
			<div className="bg- flex flex-row items-center justify-evenly space-x-2 pt-2">
				<Button
					color={!isDirty ? "default" : "primary"}
					disabled={!isDirty}
					onClick={handleSave}
				>
					Save
				</Button>
			</div>
		</div>
	);
};

export default ShuttlePageSettings;
