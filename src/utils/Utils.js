export function calculateMonthlyTraditionalMortgagePayment(years, interestRate, loanAmount) {
  // Convert years to months
  const months = years * 12;

  // Convert interest rate to monthly decimal
  const monthlyInterestRate = interestRate / 100 / 12;

  // Calculate the monthly payment using the formula
  const monthlyPayment = (
    loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)
  ) / (Math.pow(1 + monthlyInterestRate, months) - 1);

  return parseFloat(monthlyPayment.toFixed(2));
}

export function calculateMonthlyHELOCPayment(interestRate, loanAmount) {
  // Convert interest rate to monthly decimal
  const monthlyInterestRate = interestRate / 100 / 12;

  // Calculate the monthly payment using the formula
  const monthlyPayment = loanAmount * monthlyInterestRate;

  return parseFloat(monthlyPayment.toFixed(2));
}