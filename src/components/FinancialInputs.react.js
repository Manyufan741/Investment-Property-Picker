import React from 'react';
import { Row, Col, Form, Card } from "react-bootstrap";

import { calculateMonthlyTraditionalMortgagePayment } from "../utils/Utils.js";
import "../styles/finSpec.css";

const FinancialInputs = ({ data, setData, traditionalMortgageRate, setTraditionalMortgageRate, downpayment, setDownpayment, additionalCosts, setAdditionalCosts }) => {

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'traditionalMortgageRate':
        let newTraditionalMortgageRate = parseFloat(value);
        setTraditionalMortgageRate(newTraditionalMortgageRate);
        setData(data.map((row) => {
          let monthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, newTraditionalMortgageRate, row.traditionalMortgageAmount);

          let newTotalMonthlyCost = parseFloat((monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee).toFixed(2));

          let netRatio = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (downpayment + additionalCosts)) * 100).toFixed(2));

          let capRate = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

          return { ...row, monthlyTraditionalMortgageInterest, totalMonthlyCost: newTotalMonthlyCost, netRatio, capRate };
        }));
        break;
      case 'downpayment':
        let newDownpayment = parseFloat(value);
        setDownpayment(newDownpayment);
        setData(data.map((row) => {
          // Extra downpayment would be used on taking away traditional mortgage, until it goes to zero.
          let newTraditionalMortgageAmount = row.PRICE + additionalCosts - newDownpayment;
          let newMonthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageRate, newTraditionalMortgageAmount);

          let newTotalMonthlyCost = parseFloat((newMonthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee).toFixed(2));

          let netRatio = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (newDownpayment + additionalCosts)) * 100).toFixed(2));

          let capRate = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

          return { ...row, DOWNPAYMENT: newDownpayment, traditionalMortgageAmount: newTraditionalMortgageAmount, monthlyTraditionalMortgageInterest: newMonthlyTraditionalMortgageInterest, totalMonthlyCost: newTotalMonthlyCost, netRatio, capRate };
        }));
        break;
      case 'additionalCosts':
        let newAdditionalCosts = parseFloat(value);

        // Updated additional costs would be calculated towards extra amount of traditional loan
        setAdditionalCosts(newAdditionalCosts);
        setData(data.map((row) => {
          let newTraditionalMortgageAmount = row.PRICE + newAdditionalCosts - downpayment;
          let newMonthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageRate, newTraditionalMortgageAmount);

          let newTotalMonthlyCost = parseFloat((newMonthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee).toFixed(2));


          let netRatio = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (downpayment + newAdditionalCosts)) * 100).toFixed(2));

          let capRate = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (row.PRICE + newAdditionalCosts)) * 100).toFixed(2));

          return { ...row, traditionalMortgageAmount: newTraditionalMortgageAmount, monthlyTraditionalMortgageInterest: newMonthlyTraditionalMortgageInterest, totalMonthlyCost: newTotalMonthlyCost, netRatio, capRate };
        }));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Row>
        <h4 className="financial-heading">↓ Financial Specs ↓</h4>
      </Row>
      <hr />
      <Row>
        <Col xs={4} md={4}>
          <Card>
            <Card.Body className="card">
              <Form>
                <Form.Group controlId="traditionalMortgageRate">
                  <Form.Label>貸款利率</Form.Label>
                  <Form.Control className="financial-font-size"
                    type="number"
                    name="traditionalMortgageRate"
                    value={traditionalMortgageRate}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    step={0.01}
                  />
                  <Form.Text>%</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4} md={4}>
          <Card>
            <Card.Body className="card">
              <Form>
                <Form.Group controlId="downpayment">
                  <Form.Label>首付</Form.Label>
                  <Form.Control className="financial-font-size" type="number" name="downpayment" value={downpayment} onChange={handleChange} />
                  <Form.Text>USD</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4} md={4}>
          <Card>
            <Card.Body className="card">
              <Form>
                <Form.Group controlId="additionalCosts">
                  <Form.Label>額外一次性開銷</Form.Label>
                  <Form.Control
                    className="financial-font-size"
                    type="number"
                    name="additionalCosts"
                    value={additionalCosts}
                    onChange={handleChange}
                  />
                  <Form.Text>USD</Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialInputs;
