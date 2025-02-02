"use client";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, TableFooter } from "@mui/material";
import { TableContainer } from "@mui/material";
import Link from "next/link";
//import { user } from "@nextui-org/theme";
import { toast } from "react-toastify";

import { changeDateToReadable } from "../../../../utils/changeDateToReadable";

import { getAllJourneys, getMasterJourney } from "./_actions/journeys";
import RequestNewJourney from "./_components/requestNewJourney";
import { deleteAJourney } from "./[uuid]/_actions/getJourney";

import PanelTop from "@/components/panels/panelTop";
import YesNoBox from "@/components/visual/yesNoBox";
import { hasPermission } from "@/utils/getUser";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [journeys, setJourneys] = useState<any[]>([]);
	const [masterJourney, setMasterJourney] = useState<any | null>(null);
	const [permission, setPermission] = useState<boolean>(false);

	useEffect(() => {
		const getJourneys = async () => {
			const journeyResult = await getAllJourneys();
			const masterJourneyResult = await getMasterJourney();

			if (!journeyResult) {
				setError("No requests found");
				setIsLoading(false);

				return;
			}

			if (!masterJourneyResult) {
				setError("No requests found");
				setIsLoading(false);

				return;
			}

			await setJourneys(journeyResult);
			await setMasterJourney(masterJourneyResult);
			setIsLoading(false);
		};

		setInterval(() => {
			getJourneys();
		}, 5000);
		getJourneys();

		const fetchUserPemission = async () => {
			setPermission(await hasPermission("sorterJourneyEdit"));
		};

		fetchUserPemission();
	}, []);

	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		//does the user have permission to delete this journey?
		//if not, return
		//if yes,
		//setConfirmDelete(id);

		if (!permission) {
			toast.error(
				'You do not have permission to delete this journey, you require the "sorterJourneyEdit" permission Please ask admin to grant access.'
			);

			return;
		}

		setConfirmDelete(id);
	};

	const confirmDeleteJourney = async (id: string) => {
		setIsLoading(true);

		const result = await deleteAJourney(id);

		if (!result) {
			setError("Failed to delete journey");
			setIsLoading(false);
			setConfirmDelete(null);

			return;
		}

		const journeyResult = await getAllJourneys();

		if (!journeyResult) {
			setError("No requests found");
			setIsLoading(false);
			setConfirmDelete(null);

			return;
		}

		await setJourneys(journeyResult);
		setIsLoading(false);
		setConfirmDelete(null);
	};

	const cancelDelete = () => {
		setConfirmDelete(null);
	};

	if (isLoading) {
		return (
			<PanelTop className="h-fit w-full" title="Sorter journey's">
				<div className="flex w-full flex-col items-center justify-center">
					<p>Loading...</p>
				</div>
			</PanelTop>
		);
	}

	if (error) {
		return (
			<PanelTop className="h-fit w-full" title="Sorter journey's">
				<div className="flex w-full flex-col items-center justify-center">
					<p>{error}</p>
				</div>
			</PanelTop>
		);
	}

	return (
		<div>
			{confirmDelete && (
				<div className="fixed inset-0 flex items-center justify-center">
					<YesNoBox
						question="Are you sure you want to delete this journey?"
						onNo={cancelDelete}
						onYes={() => confirmDeleteJourney(confirmDelete)}
					/>
				</div>
			)}
			<PanelTop className="h-fit w-full" title="Sorter journey's">
				<RequestNewJourney />
				<div className="pt-4">
					<h2 className="text-lg text-slate-900 dark:text-slate-700">
						Master Journey Status: {masterJourney.status}
					</h2>
				</div>
				<div className="pt-2">
					<TableContainer className="rounded-2xl border">
						<Table size="small" sx={{ minWidth: 650 }}>
							<TableHead className="bg-slate-200 dark:bg-slate-600">
								<TableRow>
									<TableCell className="dark:text-slate-200">UL</TableCell>
									<TableCell className="dark:text-slate-200">
										Request Date
									</TableCell>

									<TableCell className="dark:text-slate-200">
										Request Status
									</TableCell>
									<TableCell className="dark:text-slate-200">Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{journeys.map((journey) => (
									<TableRow key={journey.id}>
										<TableCell>{journey.requestedUL}</TableCell>
										<TableCell>
											{changeDateToReadable(journey.createdDate)}
										</TableCell>

										<TableCell>{journey.status}</TableCell>
										<TableCell>
											<Link href={`/dashboard/sorter/journeys/${journey.id}`}>
												<Button color="primary">View</Button>
											</Link>
											<Button
												color="secondary"
												onClick={() => handleDelete(journey.id)}
											>
												Delete
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={4} />
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</div>
			</PanelTop>
		</div>
	);
}
