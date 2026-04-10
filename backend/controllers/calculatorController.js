export const calculateLoanAmount = (req, res) => {
  try {
    const { purchasePrice, downPayment, estimatedRepairCosts } = req.body;

    const maximumLoanAmount = (purchasePrice + estimatedRepairCosts) * 0.75;
    const requestedLoanAmount = Math.max(0, purchasePrice + estimatedRepairCosts - downPayment);
    const availableFunds = requestedLoanAmount < maximumLoanAmount ? requestedLoanAmount : 0;

    res.json({
      maximumLoanAmount,
      requestedLoanAmount,
      availableFunds,
      canProceed: requestedLoanAmount <= maximumLoanAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Calculation error', error: error.message });
  }
};

export const calculateProjectMetrics = (req, res) => {
  try {
    const { purchasePrice, estimatedRepairCosts, estimatedARV, closingCosts = 0 } = req.body;

    const totalInvestment = purchasePrice + estimatedRepairCosts + closingCosts;
    const profitMargin = estimatedARV - totalInvestment;
    const roiPercentage = (profitMargin / totalInvestment) * 100;
    const equityPercentage = ((estimatedARV - totalInvestment) / estimatedARV) * 100;

    res.json({
      totalInvestment,
      profitMargin,
      roiPercentage: roiPercentage.toFixed(2),
      equityPercentage: equityPercentage.toFixed(2),
      recommended: roiPercentage >= 15
    });
  } catch (error) {
    res.status(500).json({ message: 'Calculation error', error: error.message });
  }
};

export const calculateARV = (req, res) => {
  try {
    const { squareFootage, comparablePricePerSqft, marketAdjustment = 0 } = req.body;

    const baseARV = squareFootage * comparablePricePerSqft;
    const adjustedARV = baseARV * (1 + marketAdjustment / 100);

    res.json({
      baseARV,
      adjustedARV: Math.round(adjustedARV),
      perSqft: comparablePricePerSqft + (comparablePricePerSqft * marketAdjustment / 100)
    });
  } catch (error) {
    res.status(500).json({ message: 'Calculation error', error: error.message });
  }
};

export const calculatePaymentSchedule = (req, res) => {
  try {
    const { loanAmount, interestRate, termInMonths = 12 } = req.body;

    const monthlyRate = (interestRate / 100) / 12;
    const monthlyPayment = loanAmount * (
      monthlyRate * Math.pow(1 + monthlyRate, termInMonths) /
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
    );

    const totalInterest = (monthlyPayment * termInMonths) - loanAmount;

    res.json({
      monthlyPayment,
      totalInterest,
      totalPayment: monthlyPayment * termInMonths,
      interestRate: interestRate + '%'
    });
  } catch (error) {
    res.status(500).json({ message: 'Calculation error', error: error.message });
  }
};
