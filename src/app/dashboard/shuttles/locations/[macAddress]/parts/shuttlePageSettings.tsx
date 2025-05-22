import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";

import { deleteShuttle, getShuttleFromMac, updateShuttleId } from "./_actions";

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

	const handleSave = async () => {
		if (!newShuttleID) {
			setError("Shuttle ID cannot be empty");

			return;
		}

		try {
			const result = await updateShuttleId(props.macAddress, newShuttleID);

			// If updateShuttleId returns an error string, handle it here
			if ((result as any)?.error) {
				setError((result as any).error);
				toast.error("Failed to update Shuttle ID");

				return;
			}

			setNewShuttleID(newShuttleID);
			setIsDirty(false);

			toast.success("Shuttle ID updated successfully");

			//refresh the page
			setCookie("reloadNeeded", "true");
		} catch (err: any) {
			setError("Failed to update Shuttle ID");
			toast.error("Failed to update Shuttle ID");
		}
	};

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this shuttle?")) {
			try {
				const result = await deleteShuttle(props.macAddress);

				if ((result as any)?.error) {
					setError((result as any).error);
					toast.error("Failed to delete Shuttle ID");

					return;
				}

				toast.success("Shuttle ID deleted successfully");

				//go back to the previous page
				window.history.back();
			} catch (err: any) {
				setError("Failed to delete Shuttle ID");
				toast.error("Failed to delete Shuttle ID");
			}
		}
	};

	if (isLoading) {
		return <div>is loading....</div>;
	}

	if (!permission) {
		if (error) {
			return <div className="text-red-600">{error}</div>;
		}

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

	return (
		<div>
			{error && <div className="mb-2 text-red-600">{error}</div>}
			<Input
				defaultValue={shuttleID || ""}
				id="shuttleID"
				label="Shuttle ID"
				onChange={handleShuttleIdChange}
				onKeyDown={async (event: { key: string }) => {
					if (event.key === "Enter") {
						await handleSave();
					}
				}}
			/>
			<div className="flex flex-row items-center justify-evenly space-x-2 pt-2">
				<div className="bg- flex flex-row items-center justify-evenly space-x-2 pt-2">
					<Button
						color={!isDirty ? "default" : "primary"}
						disabled={!isDirty}
						onPress={handleSave}
					>
						Save
					</Button>
				</div>
				<div className="bg- flex flex-row items-center justify-evenly space-x-2 pt-2">
					<Button color="danger" onPress={handleDelete}>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ShuttlePageSettings;
