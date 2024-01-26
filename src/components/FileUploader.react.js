import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/finSpec.css";

import { calculateMonthlyTraditionalMortgagePayment } from "../utils/Utils.js";
import { propertyTaxRateMap } from "../utils/Consts.js";

const FileUploader = ({ setData, isChecked, setIsChecked, traditionalMortgageRate, downpayment, additionalCosts }) => {
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
    setIsChecked(false);
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

        let traditionalMortgageAmount = listingPrice + additionalCosts - downpayment;
        let monthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageRate, traditionalMortgageAmount);
        let homeInsurance = 170;
        let managementFee = 80;

        // ------------------------------------------------------------------------

        let monthlyPropertyTax = parseFloat((listingPrice * (propertyTaxRateMap[dict['CITY']] ?? 0.51 * 0.01) / 12).toFixed(2));

        // Peoria has better rent/sqft ratio
        let estimatedRent = (dict['CITY'].toLowerCase() === 'peoria')
          ? parseFloat((parseInt(dict['SQUARE FEET']) * 1).toFixed(2)) + 200
          : parseFloat((parseInt(dict['SQUARE FEET']) * 1).toFixed(2));

        let annualIncome = estimatedRent * 12;
        let monthlyHOA = parseFloat(dict['HOA/MONTH'] === null ? 0 : parseFloat(dict['HOA/MONTH']));

        let totalMonthlyCost = parseFloat((monthlyTraditionalMortgageInterest + monthlyPropertyTax + monthlyHOA + homeInsurance + managementFee).toFixed(2));

        let totalAnnualCost = parseFloat((totalMonthlyCost * 12).toFixed(2));

        let netRatio = parseFloat(((annualIncome - totalAnnualCost) / (downpayment + additionalCosts) * 100).toFixed(2));

        let capRate = parseFloat(((annualIncome - totalAnnualCost) / (listingPrice + additionalCosts) * 100).toFixed(2));

        const urlEntry = Object.entries(dict)
          .find(([key, value]) => key.includes('URL'));

        let url = "http://google.com";

        if (urlEntry) {
          url = urlEntry[1];
        }

        if (dict['CITY'] === 'Las Vegas') {
          managementFee = parseFloat((estimatedRent * 0.08).toFixed(2));
        }

        let parsedRow = { 'ADDRESS': dict['ADDRESS'], 'POSTALCODE': dict['ZIP OR POSTAL CODE'], 'PRICE': listingPrice, 'BEDS': dict['BEDS'], 'BATHS': dict['BATHS'], 'CITY': dict['CITY'], 'SQUAREFEET': dict['SQUARE FEET'], 'LOTSIZE': dict['LOT SIZE'], 'yearBuilt': dict['YEAR BUILT'], 'daysOnMarket': dict['DAYS ON MARKET'], 'perSqft': dict['$/SQUARE FEET'], 'DOWNPAYMENT': downpayment, 'traditionalMortgageAmount': traditionalMortgageAmount, 'monthlyTraditionalMortgageInterest': monthlyTraditionalMortgageInterest, 'monthlyPropertyTax': monthlyPropertyTax, 'monthlyHOA': monthlyHOA, 'monthlyHomeInsurance': homeInsurance, 'monthlyManagementFee': managementFee, 'totalMonthlyCost': totalMonthlyCost, 'estimatedRent': estimatedRent, 'netRatio': netRatio, 'capRate': capRate, 'URL': url };

        parsedData.push(parsedRow);
      }
    }
    );
    return parsedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/preloaded_data.csv`);
        const rawData = await response.text();
        const csvData = parseCSV(rawData);
        setData(csvData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isChecked) {
      fetchData();
    }
  }, [isChecked]); // Run the effect when usePreloadedData changes

  return (
    <Card>
      <Card.Body className="card">
        <Form>
          <Form.Group controlId="file-upload">
            <Form.Label><b>Upload</b></Form.Label>
            <Form.Control className="file-upload-block" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FileUploader;