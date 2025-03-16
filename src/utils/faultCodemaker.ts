export function makeReadableFaultCode(faultCode: string) {
	if (!faultCode) {
		return "";
	}

	if (faultCode === "box") {
		return "Box";
	}

	//fault code is currently in "D60GlueTankNotReady" change to "Glue Tank Not Ready"
	let readableFaultCode = "";

	//split the fault code into words
	const words = faultCode.match(/[A-Z][a-z]+/g);

	//if we have words, join them with a space
	if (words) {
		readableFaultCode = words.join(" ");
	}

	//all words are now lowercase except the first letter of the first word
	readableFaultCode =
		readableFaultCode.charAt(0).toUpperCase() +
		readableFaultCode.slice(1).toLowerCase();

	return readableFaultCode;
}
