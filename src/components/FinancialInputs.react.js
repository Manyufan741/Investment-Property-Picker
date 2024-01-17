import React from 'react';
import { Form, Card } from "react-bootstrap";

import { calculateMonthlyTraditionalMortgagePayment } from "../utils/Utils.js";

const FinancialInputs = ({ data, setData, traditionalMortgageRate, setTraditionalMortgageRate, downpayment, setDownpayment, additionalCosts, setAdditionalCosts }) => {

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'traditionalMortgageRate':
        let newTraditionalMortgageRate = 0;
        if (!value) {
          newTraditionalMortgageRate = 0;
        } else {
          newTraditionalMortgageRate = parseFloat(value);
        }
        setTraditionalMortgageRate(newTraditionalMortgageRate);
        setData(data.map((row) => {
          let monthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, newTraditionalMortgageRate, row.traditionalMortgageAmount);

          let newTotalMonthlyCost = parseFloat((monthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee).toFixed(2));

          let netRatio = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

          return { ...row, monthlyTraditionalMortgageInterest: monthlyTraditionalMortgageInterest, totalMonthlyCost: newTotalMonthlyCost, netRatio: netRatio };
        }));
        break;
      case 'downpayment':
        let newDownpayment = 0;
        if (!value) {
          newDownpayment = 0;
        } else {
          newDownpayment = parseFloat(value);
        }
        setDownpayment(newDownpayment);
        setData(data.map((row) => {
          // Extra downpayment would be used on taking away traditional mortgage, until it goes to zero.
          let newTraditionalMortgageAmount = row.PRICE + additionalCosts - newDownpayment;
          let newMonthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageRate, newTraditionalMortgageAmount);

          let newTotalMonthlyCost = parseFloat((newMonthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee).toFixed(2));

          let netRatio = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (row.PRICE + additionalCosts)) * 100).toFixed(2));

          return { ...row, DOWNPAYMENT: newDownpayment, traditionalMortgageAmount: newTraditionalMortgageAmount, monthlyTraditionalMortgageInterest: newMonthlyTraditionalMortgageInterest, totalMonthlyCost: newTotalMonthlyCost, netRatio: netRatio };
        }));
        break;
      case 'additionalCosts':
        let newAdditionalCosts = additionalCosts;
        if (!event.target.value) {
          newAdditionalCosts = additionalCosts;
        } else {
          newAdditionalCosts = parseFloat(event.target.value);
        }

        // Updated additional costs would be calculated towards extra amount of traditional loan
        setAdditionalCosts(newAdditionalCosts);
        setData(data.map((row) => {
          let newTraditionalMortgageAmount = row.PRICE + newAdditionalCosts - downpayment;
          let newMonthlyTraditionalMortgageInterest = calculateMonthlyTraditionalMortgagePayment(30, traditionalMortgageRate, newTraditionalMortgageAmount);

          let newTotalMonthlyCost = parseFloat((newMonthlyTraditionalMortgageInterest + row.monthlyPropertyTax + row.monthlyHOA + row.monthlyHomeInsurance + row.monthlyManagementFee).toFixed(2));


          let netRatio = parseFloat((((row.estimatedRent - newTotalMonthlyCost) * 12 / (row.PRICE + newAdditionalCosts)) * 100).toFixed(2));

          return { ...row, traditionalMortgageAmount: newTraditionalMortgageAmount, monthlyTraditionalMortgageInterest: newMonthlyTraditionalMortgageInterest, totalMonthlyCost: newTotalMonthlyCost, netRatio: netRatio };
        }));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h4>↓ Financial Specs ↓</h4>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group controlId="traditionalMortgageRate">
              <Form.Label>Traditional Mortgage Interest Rate</Form.Label>
              <Form.Control
                type="number"
                name="traditionalMortgageRate"
                value={traditionalMortgageRate}
                onChange={handleChange}
                min={0}
                max={100}
                step={0.01}
              />
              <Form.Text className="text-muted">%</Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Body>
          <Form>
            <Form.Group controlId="downpayment">
              <Form.Label>Downpayment</Form.Label>
              <Form.Control type="number" name="downpayment" value={downpayment} onChange={handleChange} />
              <Form.Text className="text-muted">USD</Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Body>
          <Form>
            <Form.Group controlId="additionalCosts">
              <Form.Label>Additional One Time Cost</Form.Label>
              <Form.Control
                type="number"
                name="additionalCosts"
                value={additionalCosts}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">USD</Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FinancialInputs;
