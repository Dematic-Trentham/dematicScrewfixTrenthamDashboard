"use client";
import { updateUrlParams } from "@/utils/url/params";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";

export function totalTimeSelector(
	totalTime: number,
	searchParams: URLSearchParams,
	router: AppRouterInstance,
	setTotalTime: React.Dispatch<React.SetStateAction<number>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
	return (
		<div style={{ marginTop: "20px", textAlign: "center" }}>
			<label htmlFor="totalTime">Select Total Search Time: </label>
			<select
				id="totalTime"
				value={totalTime}
				onChange={async (e) => {
					await updateUrlParams(
						searchParams,
						router,
						"timeRange",
						e.target.value
					);
					setTotalTime(Number(e.target.value));
					setLoading(true);
				}}
			>
				<option value={5}>5 minutes</option>
				<option value={10}>10 minutes</option>
				<option value={15}>15 minutes</option>
				<option value={30}>30 minutes</option>
				<option value={60}>1 hour</option>
				<option value={120}>2 hours</option>
				<option value={180}>3 hours</option>
				<option value={360}>6 hours</option>
				<option value={720}>12 hours</option>
				<option value={1440}>1 day</option>
				<option value={2880}>2 days</option>
				<option value={4320}>3 days</option>
				<option value={5760}>4 days</option>
				<option value={7200}>5 days</option>
				<option value={8640}>6 days</option>
				<option value={10080}>1 week</option>
				<option value={20160}>2 weeks</option>
				<option value={43200}>1 month</option>
				<option value={86400}>2 months</option>
				<option value={129600}>3 months</option>
				<option value={172800}>4 months</option>
				<option value={216000}>5 months</option>
				<option value={259200}>6 months</option>
			</select>
		</div>
	);
}
