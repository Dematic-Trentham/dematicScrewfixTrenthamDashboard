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

import { changeDateToReadable } from "../../../../utils/changeDateToReadable";

import { getAllJourneys } from "./_actions/journeys";
import RequestNewJourney from "./_components/requestNewJourney";

import PanelTop from "@/components/panels/panelTop";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [journeys, setJourneys] = useState<any[]>([]);

	useEffect(() => {
		const getJourneys = async () => {
			const journeyResult = await getAllJourneys();

			if (!journeyResult) {
				setError("No requests found");
				setIsLoading(false);

				return;
			}

			await setJourneys(journeyResult);
			setIsLoading(false);
		};

		setInterval(() => {
			getJourneys();
		}, 5000);
		getJourneys();
	}, []);

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
		<PanelTop className="h-fit w-full" title="Sorter journey's">
			<RequestNewJourney />
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
	);
}
