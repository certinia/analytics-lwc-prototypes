/*
 * Copyright (c) 2021 FinancialForce.com, inc. All rights reserved.
 */

import { api, LightningElement } from "lwc";

const lineDelimiter = "\n",
	fieldDelimiter = ",",
	escapeCharacter = '"';

export default class ExportCSV extends LightningElement {
	@api results;
	@api fileName;
	@api buttonName;

	downloadCSVFile() {
		const { fileName, results } = this,
			headersArray = [...new Set(results.flatMap(Object.keys))],
			headersString = headersArray.join(fieldDelimiter),
			rowStrings = results.map(this.createCSVRowStringFactory(headersArray)),
			result = [headersString].concat(rowStrings).join(lineDelimiter);
		this.startDownload(result, fileName);
	}

	createCSVRowStringFactory(headersArray) {
		return (rowObject) =>
			headersArray
				.map((header) => (rowObject[header] ? rowObject[header] : ""))
				.map(this.escapeCSVString)
				.join(fieldDelimiter);
	}

	escapeCSVString(csvString) {
		if (csvString.includes(fieldDelimiter)) {
			const escapedString = csvString.replaceAll(
				escapeCharacter,
				escapeCharacter + escapeCharacter
			);
			return escapeCharacter + escapedString + escapeCharacter;
		}
		return csvString;
	}

	startDownload(data, name) {
		const blob = new Blob([data], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const downloadElement = document.createElement("a");
		downloadElement.href = url;
		downloadElement.target = "_self";
		downloadElement.download = name + ".csv";
		document.body.appendChild(downloadElement);
		downloadElement.click();
	}
}
