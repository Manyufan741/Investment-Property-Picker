import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

import EditableCell from "./EditableCell.react.js";

import "../styles/table.css";
import Bluey from "../images/Bluey.png";
import Bingo from "../images/Bingo.png";


const PropertyTable = ({ data, setData, onEditRent, onSort, traditionalMortgageRate, downpayment, additionalCosts }) => {
	const [sortField, setSortField] = useState("netRatio");
	const [sortDirection, setSortDirection] = useState("asc");

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

		let netRatio = parseFloat((((newRent - (row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee)) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		setData(newData);
	};

	const handlePropertyTaxChange = (index, newPropertyTax) => {
		const newData = [...data];
		newData[index].monthlyPropertyTax = newPropertyTax;
		const row = newData[index];

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = row.monthlyTraditionalMortgageInterest + newPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee;

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		setData(newData);
	};

	const handleMonthlyHomeInsuranceChange = (index, newMonthlyHomeInsurance) => {
		const newData = [...data];
		newData[index].monthlyHomeInsurance = newMonthlyHomeInsurance;
		const row = newData[index];

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + newMonthlyHomeInsurance + row.monthlyManagementFee;

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		setData(newData);
	};

	const handleMonthlyManagementFeeChange = (index, newMonthlyManagementFee) => {
		const newData = [...data];
		newData[index].monthlyManagementFee = newMonthlyManagementFee;
		const row = newData[index];

		// Recalculate total monthly cost for the updated row
		newData[index].totalMonthlyCost = row.monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + newMonthlyManagementFee;

		// Recalculate netRatio for the updated row
		let netRatio = parseFloat((((row.estimatedRent - newData[index].totalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

		newData[index].netRatio = netRatio;

		setData(newData);
	};

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
				<img src={Bluey} alt="Cute" style={{ width: "7%", height: "auto" }} />
				<h3>Property Details Breakdown</h3>
				<img src={Bingo} alt="Cute" style={{ width: "7%", height: "auto" }} />
			</div>
			{
				data.length > 0 && (
					<div className="table-container">
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>Address</th>
									<th>City</th>
									<th>Postal Code</th>
									<th>Listing Price(售價)</th>
									<th>Beds & Baths</th>
									<th>Sqft</th>
									<th>Lot Size</th>
									<th className="monthly-cost-cells">Monthly Traditional Mortgage Interest</th>
									<th className="monthly-cost-cells">Monthly Property Tax (月房產稅)</th>
									<th className="monthly-cost-cells">Monthly HOA</th>
									<th className="monthly-cost-cells">Monthly Home Insurance</th>
									<th className="monthly-cost-cells">Monthly Management Fee</th>
									<th className="monthly-cost-cells">Total Monthly Cost</th>
									<th>Estimated Monthly Rent(預估月租)</th>
									<th onClick={() => handleSort("netRatio")}>
										Net Ratio(出租回報率)
										{sortField === "netRatio" && sortDirection === "asc" && <span> ↑ </span>}
										{sortField === "netRatio" && sortDirection === "desc" && <span> ↓ </span>}
									</th>
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
										<td>${row.PRICE}</td>
										<td>{row.BEDS}b{row.BATHS}b</td>
										<td>{row.SQUAREFEET}</td>
										<td>{row.LOTSIZE}</td>
										<td className="monthly-cost-cells">{row.monthlyTraditionalMortgageInterest}</td>
										<td className="monthly-cost-cells">{<EditableCell value={row.monthlyPropertyTax} onValueChange={(newPropertyTax) => handlePropertyTaxChange(index, newPropertyTax)} />}</td>
										<td className="monthly-cost-cells">{row.monthlyHOA}</td>
										<td className="monthly-cost-cells">{<EditableCell value={row.monthlyHomeInsurance} onValueChange={(newMonthlyHomeInsurance) => handleMonthlyHomeInsuranceChange(index, newMonthlyHomeInsurance)} />}</td>
										<td className="monthly-cost-cells">{<EditableCell value={row.monthlyManagementFee} onValueChange={(newMonthlyManagementFee) => handleMonthlyManagementFeeChange(index, newMonthlyManagementFee)} />}</td>
										<td className="monthly-cost-cells">{row.totalMonthlyCost}</td>
										<td>{<EditableCell value={row.estimatedRent} onValueChange={(newRent) => handleRentChange(index, newRent)} />}</td>
										<td>{row.netRatio} %</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				)}
		</div>
	);
};

export default PropertyTable;