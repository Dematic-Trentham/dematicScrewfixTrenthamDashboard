"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { form } from "@nextui-org/theme";

import { addIp } from "../_actions/actions";

import PanelTop from "@/components/panels/panelTop";
import { hasPermission } from "@/utils/getUser";
import Loading from "@/components/visual/loading";

const AddPage: React.FC = () => {
	const [permission, setPermission] = useState(false);
	const [loading, setLoading] = useState(true);
	const [addAnother, setAddAnother] = useState(false);
	const [isPLC, setIsPLC] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserPemission = async () => {
			setPermission(await hasPermission("shuttleEdit"));
			setLoading(false);
		};

		fetchUserPemission();
	}, []);

	if (loading) {
		return <Loading />;
	}

	if (!permission) {
		return (
			<PanelTop
				className="w-full"
				title="Add New IP"
				topRight={<Link href="/dashboard/ping">Back</Link>}
			>
				<h1 className="mb-4 text-2xl font-bold">Add New IP</h1>
				<p className="text-red-500">
					You do not have permission to add new IPs.
				</p>
			</PanelTop>
		);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const ipAddress = formData.get("ipAddress") as string;
		const machineName = formData.get("machineName") as string;
		const plcSlot = formData.get("plcSlot") as string;
		const isPLC = formData.get("isPLC") as string;

		const addAnother = formData.get("addAnother") as string;

		if (!ipAddress || !machineName) {
			setError("Please fill in all fields.");

			return;
		}

		if (isPLC && !plcSlot) {
			setError("Please fill in all fields.");

			return;
		}

		//is valid ip address
		const ipRegex =
			/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

		if (!ipRegex.test(ipAddress)) {
			setError("Please enter a valid IP address.");

			return;
		}

		//is valid machine name
		const machineNameRegex = /^[a-zA-Z0-9-_ ]+$/;

		if (!machineNameRegex.test(machineName)) {
			setError("Please enter a valid machine name.");

			return;
		}

		//is valid plc slot
		if (isPLC && plcSlot) {
			const plcSlotRegex = /^[0-9]+$/;

			if (!plcSlotRegex.test(plcSlot)) {
				setError("Please enter a valid PLC slot.");

				return;
			}
		}

		const result = await addIp(
			ipAddress,
			machineName,
			isPLC === "on" ? true : false,
			plcSlot ? parseInt(plcSlot) : 0
		);

		if (result.error) {
			setError(result.error);

			return;
		}

		toast.success("IP added successfully", {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});

		setError(null);
		if (addAnother) {
			formData.set("ipAddress", "");
			formData.set("machineName", "");
			formData.set("plcSlot", "");
			formData.set("isPLC", "on");
		} else {
			//go back
			window.location.href = "/dashboard/ping";
		}
	}

	return (
		<PanelTop
			className="w-full"
			title="Add New IP"
			topRight={<Link href="/dashboard/ping">Back</Link>}
		>
			<h1 className="mb-4 text-2xl font-bold">Add New IP</h1>
			{error && <p className="text-red-500">{error}</p>}

			<form className="flex flex-col" onSubmit={handleSubmit}>
				<input
					className="mb-4 rounded border border-gray-300 bg-gray-800 p-2 text-white"
					name="ipAddress"
					placeholder="IP Address"
					type="text"
				/>
				<input
					className="mb-4 rounded border border-gray-300 bg-gray-800 p-2 text-white"
					name="machineName"
					placeholder="Machine Name"
					type="text"
				/>
				<div className="mb-4 flex w-full space-x-4">
					<label className="mb-4 flex items-center">
						<input
							checked={isPLC}
							className="mr-2"
							name="isPLC"
							type="checkbox"
							onChange={(e) => setIsPLC(e.target.checked)}
						/>
						PLC?
					</label>
					<input
						className="mb-4 rounded border border-gray-300 bg-gray-800 p-2 text-white"
						disabled={!isPLC}
						name="plcSlot"
						placeholder="PLC Slot ?"
						type="number"
					/>
				</div>
				<button
					className="mb-4 rounded bg-blue-500 p-2 text-white"
					type="submit"
				>
					Add IP
				</button>

				<label className="flex items-center space-x-2">
					<input
						checked={addAnother}
						className="form-checkbox"
						name="addAnother"
						type="checkbox"
						onChange={(e) => setAddAnother(e.target.checked)}
					/>
					<span>Add Another</span>
				</label>
			</form>
		</PanelTop>
	);
};

export default AddPage;
