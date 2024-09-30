export type shuttleLocation = {
	macAddress: string;
	shuttleID: string;
	currentLocation: string;
	locationLastUpdated: Date;
	currentFirmwareVersion: string;
	lastFirmwareUpdate: string;
};

export type shuttleFault = {
	ID: string;
	timestamp: Date;
	aisle: number;
	level: number;
	macAddress: string;
	shuttleID: string;
	faultCode: string;
	xLocation: number;
	ZLocation: number;
	WLocation: number;
	resolvedTimestamp: Date | null;
	resolvedReason: string;
	xCoordinate: number;
	rawInfo: string;
};

export type shuttleFaultGroup = {
	faultCode: string;
	count: number;
};

export type shuttleFaultCodeLookup = {
	ID: string;
	faultMessage: string;
};
