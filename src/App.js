import './App.css';

import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import FileUploader from './components/FileUploader.react.js';
import FinancialInputs from './components/FinancialInputs.react.js';
import PropertyTable from './components/PropertyTable.react.js';
import ExportButton from './components/ExportButton.react.js';
import CheckBox from './components/CheckBox.react.js';

function App() {
  const [data, setData] = useState([]);
  const [traditionalMortgageRate, setTraditionalMortgageRate] = useState(6.625);
  const [downpayment, setDownpayment] = useState(260000);
  const [additionalCosts, setAdditionalCosts] = useState(10000);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="App">
      <Container fluid>
        <h1>投資房選擇小幫手</h1>
        <hr />
        <Row>
          <Col xs={3} md={3}>
            <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
            <br />
            <FileUploader setData={setData} isChecked={isChecked} setIsChecked={setIsChecked} traditionalMortgageRate={traditionalMortgageRate} downpayment={downpayment} additionalCosts={additionalCosts} />
          </Col>
          <Col xs={9} md={9}>
            <FinancialInputs data={data} setData={setData} traditionalMortgageRate={traditionalMortgageRate} setTraditionalMortgageRate={setTraditionalMortgageRate} downpayment={downpayment} setDownpayment={setDownpayment} additionalCosts={additionalCosts} setAdditionalCosts={setAdditionalCosts} />
          </Col>
          {/* <img src={bluey} alt="Cute" style={{ width: "100%", height: "auto" }} /> */}
        </Row>
        <hr className="hr-style" />
        <Row>
          <PropertyTable
            data={data}
            setData={setData}
            traditionalMortgageRate={traditionalMortgageRate}
            downpayment={downpayment}
            additionalCosts={additionalCosts}
          />
          <ExportButton data={data} />
        </Row>
      </Container>
    </div>
  );
}

export default App;