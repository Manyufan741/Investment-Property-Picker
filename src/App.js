import './App.css';

import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import FileUploader from './components/FileUploader.react.js';
import FinancialInputs from './components/FinancialInputs.react.js';
import PropertyTable from './components/PropertyTable.react.js';
import ExportButton from './components/ExportButton.react.js';

function App() {
  const [data, setData] = useState([]);
  const [traditionalMortgageRate, setTraditionalMortgageRate] = useState(7);
  const [downpayment, setDownpayment] = useState(250000);
  const [additionalCosts, setAdditionalCosts] = useState(20000);

  return (
    <div className="App">
      <Container fluid>
        <h1>Customizable Investment Property Selection</h1>
        <hr />
        <Row>
          <Col md={2}>
            <FileUploader setData={setData} />
            <hr />
            <FinancialInputs data={data} setData={setData} traditionalMortgageRate={traditionalMortgageRate} setTraditionalMortgageRate={setTraditionalMortgageRate} downpayment={downpayment} setDownpayment={setDownpayment} additionalCosts={additionalCosts} setAdditionalCosts={setAdditionalCosts} />
          </Col>
          <Col md={10}>
            <PropertyTable data={data} setData={setData} traditionalMortgageRate={traditionalMortgageRate} downpayment={downpayment} additionalCosts={additionalCosts} />
            <ExportButton data={data} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;