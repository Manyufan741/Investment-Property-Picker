import React, { useState } from 'react';
import EditableCell from "./EditableCell.react.js";
import { Table } from 'react-bootstrap';

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

    return (
        <div>
            <h3>Property Details Breakdown</h3>
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
                                    <th>Monthly Traditional Mortgage Interest</th>
                                    <th>Monthly Property Tax (月房產稅)</th>
                                    <th>Monthly HOA</th>
                                    <th>Monthly Home Insurance</th>
                                    <th>Monthly Management Fee</th>
                                    <th>Total Monthly Cost</th>
                                    <th>Estimated Monthly Rent(預估月租)</th>
                                    {/* <th>Net Ratio(出租回報率[%])</th> */}
                                    <th onClick={() => handleSort("netRatio")}>
                                        Net Ratio(出租回報率[%])
                                        {sortField === "netRatio" && sortDirection === "asc" && <span> ↑ </span>}
                                        {sortField === "netRatio" && sortDirection === "desc" && <span> ↓ </span>}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {sortData(data, sortField, sortDirection).map((row, index) => ( */}
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
                                        <td>{row.monthlyTraditionalMortgageInterest}</td>
                                        <td>{row.monthlyPropertyTax}</td>
                                        <td>{row.monthlyHOA}</td>
                                        <td>{row.monthlyHomeInsurance}</td>
                                        <td>{row.monthlyManagementFee}</td>
                                        <td>{row.totalMonthlyCost}</td>
                                        <td>{<EditableCell value={row.estimatedRent} onValueChange={(newRent) => handleRentChange(index, newRent)} />}</td>
                                        <td>{row.netRatio}</td>
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