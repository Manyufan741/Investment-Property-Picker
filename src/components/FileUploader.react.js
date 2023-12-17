import React, { useState } from 'react';
import Papa from 'papaparse';
import { Table, Form, Row, Col, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/table.css";
// import StickyTable from "react-sticky-table";
import EditableCell from "./EditableCell.react.js";
import ExportButton from './ExportButton.react.js';

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

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [additionalCost, setAdditionalCost] = useState(20600);
  const [homeInsurance, setHomeInsurance] = useState(64);
  const [managementFee, setManagementFee] = useState(80);

  const [sortField, setSortField] = useState("netRatio");
  const [sortDirection, setSortDirection] = useState("asc");

  // const sortData = (data, field, direction) => {
  //   const sortedData = [...data].sort((a, b) => {
  //     if (a[field] === b[field]) {
  //       return 0;
  //     }
  //     return a[field] > b[field] ? (direction === "asc" ? 1 : -1) : (direction === "asc" ? -1 : 1);
  //   });
  //   return sortedData;
  // };

  const sortData = (data, field, direction) => {
    return [...data].sort((a, b) => {
      if (a[field] === b[field]) {
        return 0;
      }
      return a[field] > b[field] ? (direction === "asc" ? 1 : -1) : (direction === "asc" ? -1 : 1);
    });
  };
  

  // const handleSort = (field) => {
  //   const newSortField = field === sortField ? sortField : field;
  //   const newSortDirection = newSortField === sortField && sortDirection === "asc" ? "desc" : "asc";
  //   const sortedData = sortData(data, newSortField, newSortDirection);
  //   setData(sortedData);
  //   setSortField(newSortField);
  //   setSortDirection(newSortDirection);
  // };

  const handleSort = (field) => {
    const newSortField = field;
    const newSortDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
  
    // Update the state with the sorted data
    setData(prevData => sortData(prevData, newSortField, newSortDirection));
  
    // Update the sort field and direction
    setSortField(newSortField);
    setSortDirection(newSortDirection);
  };
  

  const handleRentChange = (index, newRent) => {
    const newData = [...data];
    newData[index].estimatedRent = newRent;

    console.log('----------');
    console.log('index:', index);
    console.log( newData[index].estimatedRent);
  
    // Recalculate netRatio for the updated row
    const row = newData[index];
    let monthlyInterest = parseFloat(((row.PRICE - downPayment + additionalCost) * interestRate * 0.01 / 12).toFixed(2));
    let netRatio = parseFloat((((newRent - (monthlyInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee)) * 12 / (row.PRICE + additionalCost)) * 100).toFixed(2));
  
    newData[index].netRatio = netRatio;

    
    console.log('new netRaio is:', newData[index].netRatio);
  
    setData(newData);
  };

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

  const handleDownPaymentChange = (event) => {
    let newDownPayment = 0;
    if (!event.target.value){
      newDownPayment = 0;
    }else{
      newDownPayment = parseFloat(event.target.value);
    }    
    setDownPayment(newDownPayment);
    setData(data.map((row) => {
      let monthlyInterest = parseFloat(((row.PRICE - newDownPayment + additionalCost) * interestRate * 0.01 / 12).toFixed(2));

      let netRatio = parseFloat((((row.estimatedRent - (monthlyInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee)) * 12 / (row.PRICE + additionalCost))*100).toFixed(2));
      
      return { ...row, DOWNPAYMENT: newDownPayment, LOANAMOUNT: (parseFloat(row.PRICE) - newDownPayment + additionalCost).toFixed(2), monthlyInterest: monthlyInterest, netRatio:netRatio};
    }));
  };

  const handleInterestRateChange = (event) => {
    let newInterestRate = 0;
    if (!event.target.value){
      newInterestRate = 0;
    }else{
      newInterestRate = parseFloat(event.target.value);
    }    
    setInterestRate(newInterestRate);
    setData(data.map((row) => {
      let monthlyInterest = parseFloat(((row.PRICE - downPayment + additionalCost) * newInterestRate * 0.01 / 12).toFixed(2));

      let netRatio = parseFloat((((row.estimatedRent - (monthlyInterest + row.monthlyPropertyTax + row.monthlyHOA + homeInsurance + managementFee)) * 12 / (row.PRICE + additionalCost))*100).toFixed(2));

      return { ...row, monthlyInterest: monthlyInterest, netRatio:netRatio};
    }));
  };

  const handleAdditionalCostChange = (event) => {
    let newAdditionalCost = additionalCost;
    if(!event.target.value){
      newAdditionalCost = additionalCost;
    }else{
      newAdditionalCost = parseFloat(event.target.value);
    }
    setAdditionalCost(newAdditionalCost);
    setData(data.map((row) => {
      let newLoanAmount = parseFloat((row.PRICE - row.DOWNPAYMENT + newAdditionalCost).toFixed(2));

      let monthlyInterest = parseFloat((newLoanAmount * interestRate * 0.01 / 12).toFixed(2));

      let netRatio = parseFloat((((row.estimatedRent - (monthlyInterest + row.monthlyPropertyTax + row.monthlyHOA + homeInsurance + managementFee)) * 12 / (row.PRICE + newAdditionalCost))*100).toFixed(2));

      return { ...row, LOANAMOUNT: newLoanAmount, monthlyInterest: monthlyInterest, netRatio: netRatio};
    }));
  };

  const handleHomeInsuranceChange = (event) => {
    let newHomeInsurance = homeInsurance;
    if(!event.target.value){
      newHomeInsurance = homeInsurance;
    }else{
      newHomeInsurance = parseFloat(event.target.value);
    }
    setHomeInsurance(newHomeInsurance);
    setData(data.map((row) => {
      let monthlyInterest = parseFloat(((row.PRICE - downPayment + additionalCost) * interestRate * 0.01 / 12).toFixed(2));

      let netRatio = parseFloat((((row.estimatedRent - (monthlyInterest + row.monthlyPropertyTax + row.monthlyHOA + newHomeInsurance + row.monthlyManagementFee)) * 12 / (row.PRICE + additionalCost))*100).toFixed(2));

      return { ...row, monthlyHomeInsurance: (newHomeInsurance).toFixed(2), netRatio: netRatio};
    }));
  };

  const handleManagementFeeChange = (event) => {
    let newManagementFee = managementFee;
    if(!event.target.value){
      newManagementFee = managementFee;
    }else{
      newManagementFee = parseFloat(event.target.value);
    }
    setManagementFee(newManagementFee);

    setData(data.map((row) => {
      let monthlyInterest = parseFloat(((row.PRICE - downPayment + additionalCost) * interestRate * 0.01 / 12).toFixed(2));

      let netRatio = parseFloat((((row.estimatedRent - (monthlyInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + newManagementFee)) * 12 / (row.PRICE + additionalCost))*100).toFixed(2));

      return { ...row, monthlyManagementFee: (newManagementFee).toFixed(2), netRatio: netRatio};
    }));
  };

  // Parse CSV data using a library
  const parseCSV = (rawData) => {
    const csvData = Papa.parse(rawData, {
      header: true, // First row contains column names
      skipEmptyLines: true, // Ignore empty lines
      dynamicTyping: true, // Automatically convert data types
    });

    const allData = csvData.data; // Array of objects representing each row
    // console.log(allData);
    // const headers = csvData.meta.fields; // Array of column names
    let parsedData = [];
    allData.forEach((dict, idx) => {
      if(idx !== 0){
        let listingPrice = parseFloat(dict['PRICE']);
        let monthlyInterest = (listingPrice - downPayment) * interestRate * 0.01 / 12
        let monthlyPropertyTax = parseFloat((listingPrice * (propertyTaxRateMap[dict['CITY']] ?? 0.51 * 0.01) / 12).toFixed(2));

        let estimatedRent = parseFloat((parseInt(dict['SQUARE FEET']) * 1.15).toFixed(2));
        let annualIncome = estimatedRent * 12;
        let monthlyHOA = parseFloat(dict['HOA/MONTH'] === null ? 0 : parseFloat(dict['HOA/MONTH']));
        let totalAnnualCost = parseFloat(((monthlyInterest + monthlyPropertyTax + monthlyHOA + homeInsurance + managementFee) * 12).toFixed(2));

        let netRatio = parseFloat(((annualIncome - totalAnnualCost)/(listingPrice + additionalCost)).toFixed(2));

        const urlEntry = Object.entries(dict)
          .find(([key, value]) => key.includes('URL'));

        let url = "http://google.com";

        if (urlEntry) {
          url = urlEntry[1];
        }

        let parsedRow = {'ADDRESS': dict['ADDRESS'], 'POSTALCODE': dict['ZIP OR POSTAL CODE'], 'PRICE': listingPrice, 'BEDS': dict['BEDS'], 'BATHS': dict['BATHS'], 'CITY': dict['CITY'], 'SQUAREFEET': dict['SQUARE FEET'],'LOTSIZE':dict['LOT SIZE'],'DOWNPAYMENT': downPayment, 'LOANAMOUNT': listingPrice - downPayment + additionalCost, 'monthlyInterest': monthlyInterest, 'monthlyPropertyTax': monthlyPropertyTax, 'monthlyHOA': monthlyHOA, 'monthlyHomeInsurance': homeInsurance, 'monthlyManagementFee': managementFee, 'estimatedRent': estimatedRent, 'netRatio': netRatio, 'URL': url};

        parsedData.push(parsedRow);
      }
    }
    );
    return parsedData;
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
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
          <hr />
          <h4>↓ Financial Specs ↓</h4>
          <hr />
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="interest-rate">
                  <Form.Label>Interest Rate</Form.Label>
                  <Form.Control
                    type="number"
                    value={interestRate}
                    onChange={handleInterestRateChange}
                    min={0}
                    max={100}
                    step={0.01}
                  />
                  <Form.Text className="text-muted">%</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="downpayment">
                  <Form.Label>Downpayment</Form.Label>
                  <Form.Control type="number" value={downPayment} onChange={handleDownPaymentChange} />
                  <Form.Text className="text-muted">USD</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="additionalCost">
                  <Form.Label>Additional One Time Cost</Form.Label>
                  <Form.Control
                    type="number"
                    value={additionalCost}
                    onChange={handleAdditionalCostChange}
                  />
                  <Form.Text className="text-muted">USD</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Form>
          <Form.Group controlId="homeInsurance">
            <Form.Label>Home Insurance Per Month</Form.Label>
            <Form.Control
              type="number"
              value={homeInsurance}
              onChange={handleHomeInsuranceChange}
            />
            <Form.Text className="text-muted">USD</Form.Text>
          </Form.Group>
          </Form>
          </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Form>
          <Form.Group controlId="managementFee">
            <Form.Label>Management Fee Per Month</Form.Label>
            <Form.Control
              type="number"
              value={managementFee}
              onChange={handleManagementFeeChange}
            />
            <Form.Text className="text-muted">USD</Form.Text>
          </Form.Group>
          </Form>
          </Card.Body>
          </Card>
        </Col>
        <Col md={10}>
          <h3>Property Details Breakdown</h3>
          {data.length > 0 && (
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
                    <th>Loan Amount(貸款)</th>
                    <th>Monthly Interest(月貸款利息)</th>
                    <th>Monthly Property Tax (月房產稅)</th>
                    <th>Monthly HOA</th>
                    <th>Monthly Home Insurance</th>
                    <th>Monthly Management Fee</th>
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
                      <td>{row.LOANAMOUNT}</td>
                      <td>{row.monthlyInterest}</td>
                      <td>{row.monthlyPropertyTax}</td>
                      <td>{row.monthlyHOA}</td>
                      <td>{row.monthlyHomeInsurance}</td>
                      <td>{row.monthlyManagementFee}</td>
                      {/* <td><{row.estimatedRent}></td> */}
                      <td>{<EditableCell value={row.estimatedRent} onValueChange={(newRent) => handleRentChange(index, newRent)}/>}</td>
                      <td>{row.netRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
      <ExportButton data={data} />
    </Container>
  );
};

export default FileUploader;