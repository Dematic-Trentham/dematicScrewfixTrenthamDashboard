export const itemsPerFaultNice = (
	totalItems: number,
	totalFaults: number,
	itemName: string
) => {
	if (totalFaults === 0) {
		return `Total ${itemName} is ${totalItems} with no faults`;
	}

	if (totalItems === 0) {
		return `Total ${itemName} is ${totalFaults} faults`;
	}

	//more faults than items - return faults per item

	if (totalFaults > totalItems) {
		const faultsPerItem = (totalFaults / totalItems).toFixed(2);

		return `Total ${itemName} is ${totalItems} with ${totalFaults} faults - ${faultsPerItem} faults per item`;
	}

	//more items than faults - return items per fault
	const itemsPerFault = (totalItems / totalFaults).toFixed(2);

	return `Total ${itemName} is ${totalItems} with ${totalFaults} faults - ${itemsPerFault} items per fault`;
};
