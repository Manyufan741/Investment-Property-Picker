import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { calculateMonthlyTraditionalMortgagePayment } from "../utils/Utils.js";
import { propertyTaxRateMap } from "../utils/Consts.js";

import EditableCell from "./EditableCell.react.js";

import "../styles/table.css";
import Bluey from "../images/Bluey.png";
import Bingo from "../images/Bingo.png";


const PropertyTable = ({ data, setData, onEditRent, onSort, traditionalMortgageRate, downpayment, additionalCosts }) => {
	const [sortField, setSortField] = useState("netRatio");
	const [sortDirection, setSortDirection] = useState("desc");

	const handleSort = (field) => {
		const newSortField = field;
		const newSortDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";

		// Update the state with the sorted data
		setData(prevData => sortData(prevData, newSortField, newSortDirection));

		// Update the sort field and direction
		setSortField(newSortField);
		setSortDirection(newSortDirection);
	};

	const sortData = (data, field, direction) => {
		return [...data].sort((a, b) => {
			if (a[field] === b[field]) {
				return 0;
			}
			return a[field] > b[field] ? (direction === "asc" ? 1 : -1) : (direction === "asc" ? -1 : 1);
		});
	};

	const handleRentChange = (index, newRent) => {
		const newData = [...data];
		newData[index].estimatedRent = newRent;

		// Recalculate netRatio for the updated row
		const row = newData[index];

		let netRatio = parseFloat((((newRent - (row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee)) * 12 / (downpayment + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		let capRate = parseFloat((((newRent - (row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee)) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].capRate = capRate;

		// Recalculate writeOffMargin
		newData[index].writeOffMargin = parseFloat((newRent - (row.totalMonthlyCost + row.monthlyDepreciation)).toFixed(2));

		// Property managed by Las Vegas agent take 8% of the monthly rent as commission
		if (row.CITY === 'Las Vegas') {
			let newManagementFee = parseFloat((newRent * 0.08).toFixed(2));
			newData[index].monthlyManagementFee = newManagementFee;

			newData[index].totalMonthlyCost = parseFloat((row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + newManagementFee).toFixed(2));

			netRatio = parseFloat((((newRent - newData[index].totalMonthlyCost) / (downpayment + additionalCosts)) * 100).toFixed(2));

			newData[index].netRatio = netRatio;

			capRate = parseFloat((((newRent - newData[index].totalMonthlyCost) / (row.PRICE + additionalCosts)) * 100).toFixed(2));

			newData[index].capRate = capRate;
		}

		setData(newData);
	};

	const handleListingPriceChange = (index, newListingPrice) => {
		const newData = [...data];
		newData[index].PRICE = newListingPrice;
		const row = newData[index];

		// Recalculate mortgage amount and monthly mortgage interest
		let newTraditionalMortgageAmount = newListingPrice + additionalCosts - downpayment;
		let newMonthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageRate, newTraditionalMortgageAmount);

		newData[index].traditionalMortgageAmount = newTraditionalMortgageAmount;
		newData[index].monthlyTraditionalMortgageInterest = newMonthlyTraditionalMortgageInterest

		// Recalculate $/sqft
		newData[index].perSqft = parseInt(newListingPrice / row.SQUAREFEET);

		// Recalculate property tax
		let newMonthlyPropertyTax = parseFloat((newListingPrice * (propertyTaxRateMap[row.CITY] ?? 0.51 * 0.01) / 12).toFixed(2));
		newData[index].monthlyPropertyTax = newMonthlyPropertyTax

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = newMonthlyTraditionalMortgageInterest + newMonthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee;

		// Recalculate monthly depreciation
		let newFCV = newListingPrice * 0.9;
		newData[index].monthlyDepreciation = parseFloat((newFCV * 0.8 / 27.5 / 12).toFixed(2));

		// Recalculate write off margin
		newData[index].writeOffMargin = parseFloat((row.estimatedRent - (newData[index].totalMonthlyCost + newData[index].monthlyDepreciation)).toFixed(2));

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (downpayment + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		let capRate = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (newListingPrice + additionalCosts)) * 100).toFixed(2));

		newData[index].capRate = capRate;

		setData(newData);
	};

	const handlePropertyTaxChange = (index, newPropertyTax) => {
		const newData = [...data];
		newData[index].monthlyPropertyTax = newPropertyTax;
		const row = newData[index];

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = row.monthlyTraditionalMortgageInterest + newPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee;

		// Recalculate write off margin
		newData[index].writeOffMargin = parseFloat((row.estimatedRent - (newData[index].totalMonthlyCost + row.monthlyDepreciation)).toFixed(2));

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (downpayment + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		let capRate = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].capRate = capRate;

		setData(newData);
	};

	const handleMonthlyHomeInsuranceChange = (index, newMonthlyHomeInsurance) => {
		const newData = [...data];
		newData[index].monthlyHomeInsurance = newMonthlyHomeInsurance;
		const row = newData[index];

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + newMonthlyHomeInsurance + row.monthlyManagementFee;

		// Recalculate write off margin
		newData[index].writeOffMargin = parseFloat((row.estimatedRent - (newData[index].totalMonthlyCost + row.monthlyDepreciation)).toFixed(2));

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (downpayment + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		let capRate = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].capRate = capRate;

		setData(newData);
	};

	const handleMonthlyManagementFeeChange = (index, newMonthlyManagementFee) => {
		const newData = [...data];
		newData[index].monthlyManagementFee = newMonthlyManagementFee;
		const row = newData[index];

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + newMonthlyManagementFee;

		// Recalculate write off margin
		newData[index].writeOffMargin = parseFloat((row.estimatedRent - (newData[index].totalMonthlyCost + row.monthlyDepreciation)).toFixed(2));

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (downpayment + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		let capRate = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].capRate = capRate;

		setData(newData);
	};

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
				<img src={Bluey} alt="Cute" style={{ width: "3%", height: "auto" }} />
				<h3>Property Details Breakdown</h3>
				<img src={Bingo} alt="Cute" style={{ width: "3%", height: "auto" }} />
			</div>
			{
				data.length > 0 && (
					<div className="table-container">
						<Table striped bordered hover responsive={true}>
							<thead>
								<tr>
									<th>Address</th>
									<th>City</th>
									<th>Postal Code</th>
									<th>Listing Price(售價)</th>
									<th>Beds & Baths</th>
									<th>Sqft</th>
									<th>Lot Size</th>
									<th>Year Built</th>
									<th onClick={() => handleSort("daysOnMarket")}>
										Days on Market
										{sortField === "daysOnMarket" && sortDirection === "asc" && <span> ↑ </span>}
										{sortField === "daysOnMarket" && sortDirection === "desc" && <span> ↓ </span>}
									</th>
									<th>$/Sqft</th>
									<th className="monthly-cost-cells">Monthly Traditional Mortgage Interest</th>
									<th className="monthly-cost-cells">Monthly Property Tax (月房產稅)</th>
									<th className="monthly-cost-cells">Monthly HOA</th>
									<th className="monthly-cost-cells">Monthly Home Insurance</th>
									<th className="monthly-cost-cells">Monthly Management Fee</th>
									<th className="monthly-cost-cells">Total Monthly Cost</th>
									<th className="tax-saving-cells">Monthly Depreciation(月折舊)</th>
									<th>Estimated Monthly Rent(預估月租)</th>
									<th className="tax-saving-cells">Write Off Margin(節稅邊際)</th>
									<th style={{ borderLeft: "3px solid red", borderRight: "3px solid red", borderTop: "3px solid red" }} onClick={() => handleSort("netRatio")}>
										Net Ratio(年收益/首付)
										{sortField === "netRatio" && sortDirection === "asc" && <span> ↑ </span>}
										{sortField === "netRatio" && sortDirection === "desc" && <span> ↓ </span>}
									</th>
									{/* <th onClick={() => handleSort("capRate")}>
										Cap Rate(年收益/房價)
										{sortField === "capRate" && sortDirection === "asc" && <span> ↑ </span>}
										{sortField === "capRate" && sortDirection === "desc" && <span> ↓ </span>}
									</th> */}
								</tr>
							</thead>
							<tbody>
								{data.map((row, index) => (
									<tr key={index}>
										<td>
											<a href={row.URL} target="_blank" rel="noreferrer">
												{row.ADDRESS}
											</a>
										</td>
										<td>{row.CITY}</td>
										<td>{row.POSTALCODE}</td>
										{/* <td>${row.PRICE}</td> */}
										<td>{<EditableCell value={row.PRICE} onValueChange={(newListingPrice) => handleListingPriceChange(index, newListingPrice)} />}</td>
										<td>{row.BEDS}b{row.BATHS}b</td>
										<td>{row.SQUAREFEET}</td>
										<td>{row.LOTSIZE}</td>
										<td>{row.yearBuilt}</td>
										<td>{row.daysOnMarket}</td>
										<td>{row.perSqft}</td>
										<td className="monthly-cost-cells">{row.monthlyTraditionalMortgageInterest}</td>
										<td className="monthly-cost-cells">{<EditableCell value={row.monthlyPropertyTax} onValueChange={(newPropertyTax) => handlePropertyTaxChange(index, newPropertyTax)} />}</td>
										<td className="monthly-cost-cells">{row.monthlyHOA}</td>
										<td className="monthly-cost-cells">{<EditableCell value={row.monthlyHomeInsurance} onValueChange={(newMonthlyHomeInsurance) => handleMonthlyHomeInsuranceChange(index, newMonthlyHomeInsurance)} />}</td>
										<td className="monthly-cost-cells">{<EditableCell value={row.monthlyManagementFee} onValueChange={(newMonthlyManagementFee) => handleMonthlyManagementFeeChange(index, newMonthlyManagementFee)} />}</td>
										<td className="monthly-cost-cells">{row.totalMonthlyCost}</td>
										<td className="tax-saving-cells">{row.monthlyDepreciation}</td>
										<td>{<EditableCell value={row.estimatedRent} onValueChange={(newRent) => handleRentChange(index, newRent)} />}</td>
										<td className="tax-saving-cells">{row.writeOffMargin}</td>
										<td style={{ borderLeft: "3px solid red", borderRight: "3px solid red" }}><b>{row.netRatio} %</b></td>
										{/* <td>{row.capRate} %</td> */}
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				)
			}
		</div >
	);
};

export default PropertyTable;