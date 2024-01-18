import React, { useState } from 'react';
import Papa from 'papaparse';
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/table.css";

import { calculateMonthlyTraditionalMortgagePayment } from "../utils/Utils.js";

const propertyTaxRateMap = {
  'Anthem': 0.79 * 0.01,
  'Phoenix': 0.64 * 0.01,
  'Peoria': 0.67 * 0.01,
  'Chandler': 0.58 * 0.01,
  'Laveen': 0.73 * 0.01,
  'Glendale': 0.68 * 0.01,
  'Mesa': 0.59 * 0.01,
  'Queen Creek': 0.60 * 0.01,
  'Gilbert': 0.57 * 0.01,
  'Sun City': 0.75 * 0.01,
  'New River': 0.72 * 0.01,
  'Tempe': 0.55 * 0.01,
  'Sun City West': 0.69 * 0.01,
  'Picacho': 0.81 * 0.01,
}

const FileUploader = ({ setData }) => {
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    const validExtensions = ['xlsx', 'xls', 'csv'];
    const extension = uploadedFile.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
      alert('Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed!');
      return;
    }
    setFile(uploadedFile);
    // Read file content using FileReader API
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = parseCSV(event.target.result); // Use a CSV parser library like Papa Parse
      setData(csvData);
    };
    reader.readAsText(uploadedFile);
  };

  // Parse CSV data using a library
  const parseCSV = (rawData) => {
    const csvData = Papa.parse(rawData, {
      header: true, // First row contains column names
      skipEmptyLines: true, // Ignore empty lines
      dynamicTyping: true, // Automatically convert data types
    });

    const allData = csvData.data; // Array of objects representing each row
    let parsedData = [];
    allData.forEach((dict, idx) => {
      if (idx !== 0) {
        let listingPrice = parseFloat(dict['PRICE']);

        /**
         * These parameters are just initial values. They will be overwritten by the users through FinancialInputs 
         */
        let downPayment = 250000;
        let additionalCosts = 20000;

        let traditionalMortgageAmount = listingPrice + additionalCosts - downPayment;
        let traditionalMortgageInterestRate = 7;
        let monthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageInterestRate, traditionalMortgageAmount);
        let homeInsurance = 170;
        let managementFee = 120;
        // ------------------------------------------------------------------------

        let monthlyPropertyTax = parseFloat((listingPrice * (propertyTaxRateMap[dict['CITY']] ?? 0.51 * 0.01) / 12).toFixed(2));

        let estimatedRent = parseFloat((parseInt(dict['SQUARE FEET']) * 1).toFixed(2));
        let annualIncome = estimatedRent * 12;
        let monthlyHOA = parseFloat(dict['HOA/MONTH'] === null ? 0 : parseFloat(dict['HOA/MONTH']));

        let totalMonthlyCost = parseFloat((monthlyTraditionalMortgageInterest + monthlyPropertyTax + monthlyHOA + homeInsurance + managementFee).toFixed(2));

        let totalAnnualCost = parseFloat((totalMonthlyCost * 12).toFixed(2));

        let netRatio = parseFloat(((annualIncome - totalAnnualCost) / (listingPrice + additionalCosts) * 100).toFixed(2));

        const urlEntry = Object.entries(dict)
          .find(([key, value]) => key.includes('URL'));

        let url = "http://google.com";

        if (urlEntry) {
          url = urlEntry[1];
        }

        let parsedRow = { 'ADDRESS': dict['ADDRESS'], 'POSTALCODE': dict['ZIP OR POSTAL CODE'], 'PRICE': listingPrice, 'BEDS': dict['BEDS'], 'BATHS': dict['BATHS'], 'CITY': dict['CITY'], 'SQUAREFEET': dict['SQUARE FEET'], 'LOTSIZE': dict['LOT SIZE'], 'DOWNPAYMENT': downPayment, 'traditionalMortgageAmount': traditionalMortgageAmount, 'monthlyTraditionalMortgageInterest': monthlyTraditionalMortgageInterest, 'monthlyPropertyTax': monthlyPropertyTax, 'monthlyHOA': monthlyHOA, 'monthlyHomeInsurance': homeInsurance, 'monthlyManagementFee': managementFee, 'totalMonthlyCost': totalMonthlyCost, 'estimatedRent': estimatedRent, 'netRatio': netRatio, 'URL': url };

        parsedData.push(parsedRow);
      }
    }
    );
    return parsedData;
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group controlId="file-upload">
            <Form.Label><b>Upload</b> Property Specs List:</Form.Label>
            <Form.Control type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FileUploader;