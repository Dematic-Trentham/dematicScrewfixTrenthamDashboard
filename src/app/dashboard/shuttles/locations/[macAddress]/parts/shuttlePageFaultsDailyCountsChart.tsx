import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

type Props = {
	data: { date: string; count: number }[];
};

const ShuttlePageFaultsDailyCountsChart: React.FC<Props> = ({ data }) => {
	const chartData = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: "Missions",
				data: data.map((d) => d.count),
				fill: false,
				borderColor: "rgb(75, 192, 192)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				tension: 0.1,
			},
		],
	};

	return (
		<div style={{ width: "100%", maxWidth: "100%" }}>
			<Line
				data={chartData}
				height={300}
				options={{ maintainAspectRatio: false, responsive: true }}
				width={undefined}
			/>
		</div>
	);
};

export default ShuttlePageFaultsDailyCountsChart;
