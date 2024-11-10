//lets make a shuttle div as a graphic
interface shuttleGraphicProps {
	shuttleID: string;
	fingerPair1Color: string;
	fingerPair2Color: string;
	fingerPair3Color: string;
	fingerPair4Color: string;
	onboardToteColor: string;
	loadSensor1Color: string;
	loadSensor2Color: string;
}

const ShuttleGraphic: React.FC<shuttleGraphicProps> = (props) => {
	return (
		<div className="relative mb-4 grid h-64 w-52">
			<div className="absolute top-0 h-20 w-48 justify-self-center rounded-t-lg bg-black">
				<div className="absolute -left-2 top-2 h-6 w-2 self-center justify-self-center rounded-t-sm bg-red-500" />
				<div className="absolute -right-2 top-2 h-6 w-2 self-center justify-self-center rounded-t-sm bg-red-500" />
				<div className="self-center justify-self-center text-4xl text-white">
					{props.shuttleID}
				</div>
			</div>
			<div className="-0 absolute bottom-0 h-10 w-48 justify-self-center bg-black">
				<div className="absolute -left-2 top-3 h-6 w-2 self-center justify-self-center rounded-t-sm bg-red-500" />
				<div className="absolute -right-2 top-3 h-6 w-2 self-center justify-self-center rounded-t-sm bg-red-500" />
			</div>
			<div className="absolute top-20 h-36 w-48 justify-self-center bg-gray-200">
				<div
					className={`bg-${props.onboardToteColor} absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform rounded-md`}
				/>
				<div
					className={`bg-${props.fingerPair1Color} absolute left-2 top-0 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>
				<div
					className={`bg-${props.fingerPair1Color} absolute bottom-0 left-2 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>

				<div
					className={`bg-${props.fingerPair2Color} absolute left-10 top-0 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>
				<div
					className={`bg-${props.fingerPair2Color} absolute bottom-0 left-10 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>

				<div
					className={`bg-${props.fingerPair3Color} absolute right-2 top-0 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>
				<div
					className={`bg-${props.fingerPair3Color} absolute bottom-0 right-2 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>

				<div
					className={`bg-${props.fingerPair4Color} absolute right-10 top-0 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>
				<div
					className={`bg-${props.fingerPair4Color} absolute bottom-0 right-10 h-10 w-2 self-center justify-self-center rounded-t-sm`}
				/>

				<div
					className={`bg-${props.loadSensor1Color} absolute left-16 top-0 h-8 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full`}
				/>
				<div
					className={`bg-${props.loadSensor2Color} absolute right-12 top-0 h-8 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full`}
				/>
			</div>
		</div>
	);
};

export default ShuttleGraphic;
