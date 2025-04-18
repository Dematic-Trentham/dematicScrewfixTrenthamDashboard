"use client";
import { useState, useEffect } from "react";
import { set } from "zod";

import {
	getAllFaultLogCodes,
	updateFaultLogCode,
	createFaultLogCode,
	deleteFaultLogCode,
} from "./_actions/actions"; // Adjust the import path as necessary

import PanelMiddle from "@/components/panels/panelMiddle";
import PanelTop from "@/components/panels/panelTop";

export default function EditPage() {
	const [faultCodes, setFaultCodes] = useState<
		{ id: string; code: string; description: string }[]
	>([]);

	const [state, setState] = useState<string | null>("table");

	const [currentID, setCurrentID] = useState<string | null>(null);

	const [currentTitle, setCurrentTitle] = useState<string | null>(null);
	const [currentMessage, setCurrentMessage] = useState<string | null>(null);

	useEffect(() => {
		async function fetchFaultCodes() {
			const data = await getAllFaultLogCodes(); // Fetch fault codes from server action

			const faultCodeMapped = data.map(
				(item: { id: string; title: string; message: string }) => ({
					id: item.id,
					code: item.title,
					description: item.message, // Split the message into an array of strings
				})
			);

			console.log("faultCodeMapped", faultCodeMapped);

			setFaultCodes(faultCodeMapped); // Update state with fetched fault codes
		}
		fetchFaultCodes();
	}, [state]);

	if (state === "edit") {
		return (
			<PanelTop className="h-fit w-full" title="Edit Fault Codes">
				{/* Add your edit form or component here */}

				<p>Edit Fault Code with ID: {currentID}</p>
				{/* You can add a form or component to edit the fault code here */}

				<form
					onSubmit={async (e) => {
						e.preventDefault();
						console.log("Form submitted");

						const formData = new FormData(e.currentTarget);
						const title = formData.get("title") as string;
						const message = formData.get("message") as string;

						console.log("Title:", title);
						console.log("Message:", message);

						const response = await updateFaultLogCode(currentID!, {
							title,
							message,
						});

						console.log("Response:", response);

						setCurrentID(null);
						setCurrentTitle(null);
						setCurrentMessage(null);
						setState("table"); // Reset state to show the table again
						setFaultCodes((prev) =>
							prev.map((fault) =>
								fault.id === currentID
									? { ...fault, code: title, description: message }
									: fault
							)
						); // Update the fault codes in state
					}}
				>
					<div className="mb-4">
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor="title"
						>
							Title
						</label>
						<input
							className="mt-1 block w-full rounded-md border-gray-300 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							defaultValue={currentTitle || ""}
							id="title"
							name="title"
							type="text"
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor="message"
						>
							Message
						</label>
						<textarea
							className="mt-1 block w-full rounded-md border-gray-300 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							defaultValue={currentMessage || ""}
							id="message"
							name="message"
							rows={20}
						/>
					</div>
					<div className="flex justify-end">
						<button
							className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							type="submit"
						>
							Save
						</button>
					</div>
				</form>
			</PanelTop>
		);
	}

	if (state === "delete") {
		return (
			<PanelTop className="h-fit w-full" title="Delete Fault Code">
				<p>
					Are you sure you want to delete the fault code with ID: {currentID}?
				</p>

				<p>
					This action cannot be undone. Please confirm that you want to delete
					this fault code.
				</p>

				<p>
					<strong>Fault Code:</strong>{" "}
					{faultCodes.find((fault) => fault.id === currentID)?.code}
				</p>
				<p>
					<strong>Description:</strong>{" "}
					{faultCodes.find((fault) => fault.id === currentID)?.description}
				</p>

				<div className="mt-4 flex justify-end">
					<button
						className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						onClick={() => setState("table")}
					>
						Cancel
					</button>
					<button
						className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						onClick={async () => {
							console.log("Deleting fault code with ID:", currentID);

							// Call your delete function here
							await deleteFaultLogCode(currentID!);

							setFaultCodes((prev) =>
								prev.filter((fault) => fault.id !== currentID)
							); // Remove the deleted fault code from state

							setCurrentID(null);
							setState("table"); // Reset state to show the table again
						}}
					>
						Delete
					</button>
				</div>
			</PanelTop>
		);
	}

	if (state === "add") {
		return (
			<PanelTop className="h-fit w-full" title="Add Fault Codes" topRight="">
				{/* Add your add form or component here */}
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						console.log("Form submitted");

						const formData = new FormData(e.currentTarget);
						const title = formData.get("title") as string;
						const message = formData.get("message") as string;

						console.log("Title:", title);
						console.log("Message:", message);

						const response = await createFaultLogCode({
							title,
							message,
						});

						console.log("Response:", response);

						setCurrentID(null);
						setCurrentTitle(null);
						setCurrentMessage(null);
						setState("table"); // Reset state to show the table again
					}}
				>
					<div className="mb-4">
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor="title"
						>
							Title
						</label>
						<input
							className="mt-1 block w-full rounded-md border-gray-300 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							defaultValue={currentTitle || ""}
							id="title"
							name="title"
							type="text"
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor="message"
						>
							Message
						</label>
						<textarea
							className="sm:text -sm mt-1 block w-full rounded-md border-gray-300 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							defaultValue={currentMessage || ""}
							id="message"
							name="message"
							rows={20}
						/>
					</div>

					<div className="flex justify-end space-x-1">
						<button
							className="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							type="submit"
						>
							Add
						</button>
						<button
							className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							onClick={() => setState("table")}
						>
							Back
						</button>
					</div>
				</form>
			</PanelTop>
		);
	}

	if (state === "table") {
		return (
			<PanelTop className="h-fit w-full" title="Fault Codes">
				<div className="mb-4">
					<button
						className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
						onClick={handleAdd}
					>
						Add Fault Code
					</button>
				</div>
				<table className="dematicTable ce">
					<thead>
						<tr>
							<th>Code</th>
							<th>Description</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{faultCodes.map((fault) => (
							<tr key={fault.id}>
								<td>{fault.code}</td>
								<td>{fault.description}</td>
								<td>
									<div className="flex flex-col p-1">
										<button
											className="mb-2 inline-flex w-24 justify-center rounded-md border border-transparent bg-blue-600 py-1 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
											onClick={() => handleEdit(fault.id)}
										>
											Edit
										</button>
										<button
											className="inline-flex w-24 justify-center rounded-md border border-transparent bg-red-600 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
											onClick={() => handleDelete(fault.id)}
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</PanelTop>
		);
	}

	function handleEdit(id: string) {
		// Handle edit action here
		console.log("Edit fault code with ID:", id);
		// You can navigate to an edit page or open a modal for editing

		setCurrentID(id);
		setCurrentTitle(faultCodes.find((fault) => fault.id === id)?.code || "");
		setCurrentMessage(
			faultCodes.find((fault) => fault.id === id)?.description || ""
		);
		setState("edit");
	}

	function handleAdd() {
		// Handle add action here
		console.log("Add new fault code");
		// You can navigate to an add page or open a modal for adding

		setState("add");
	}

	function handleDelete(id: string) {
		// Handle delete action here
		console.log("Delete fault code with ID:", id);
		// You can show a confirmation dialog and then delete the fault code

		setCurrentID(id);
		setState("delete");
	}
}
