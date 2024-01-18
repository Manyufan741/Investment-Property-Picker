import './App.css';

import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import FileUploader from './components/FileUploader.react.js';
import FinancialInputs from './components/FinancialInputs.react.js';
import PropertyTable from './components/PropertyTable.react.js';
import ExportButton from './components/ExportButton.react.js';
import CheckBox from './components/CheckBox.react.js';

import bluey from './images/bluey.webp';

function App() {
  const [data, setData] = useState([]);
  const [traditionalMortgageRate, setTraditionalMortgageRate] = useState(7);
  const [downpayment, setDownpayment] = useState(250000);
  const [additionalCosts, setAdditionalCosts] = useState(20000);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="App">
      <Container fluid>
        <h1>Customizable Investment Property Selection</h1>
        <hr />
        <Row>
          <Col md={2}>
            <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
            <br />
            <FileUploader setData={setData} isChecked={isChecked} setIsChecked={setIsChecked} />
            <hr />
            <FinancialInputs data={data} setData={setData} traditionalMortgageRate={traditionalMortgageRate} setTraditionalMortgageRate={setTraditionalMortgageRate} downpayment={downpayment} setDownpayment={setDownpayment} additionalCosts={additionalCosts} setAdditionalCosts={setAdditionalCosts} />
            <br />
            <img src={bluey} alt="Cute" style={{ width: "100%", height: "auto" }} />
          </Col>
          <Col md={10}>
            <PropertyTable data={data} setData={setData} traditionalMortgageRate={traditionalMortgageRate} downpayment={downpayment} additionalCosts={additionalCosts} />
            <br />
            <ExportButton data={data} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;