import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../frontend/dist')));

// Mock data
const mockUsers = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    state: 'KS',
    role: 'user_applicant'
  }
];

const mockLoans = [
  {
    _id: 'loan1',
    applicant: 'user1',
    purchasePrice: 150000,
    repairs: 50000,
    arv: 300000,
    status: 'submitted',
    state: 'KS',
    propertyDetails: {
      address: '123 Test St',
      city: 'Wichita',
      state: 'KS',
      zip: '67202'
    },
    createdAt: new Date().toISOString()
  }
];

// Mock routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock server running' });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === 'mock-token-123') {
    res.json({ user: mockUsers[0] });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (email === 'test@example.com') {
    res.json({ 
      token: 'mock-token-123',
      user: mockUsers[0]
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    token: 'mock-token-123',
    user: mockUsers[0]
  });
});

app.get('/api/loans/my-loans', (req, res) => {
  res.json({ count: 1, loans: mockLoans });
});

app.post('/api/calculators/loan-amount', (req, res) => {
  const { purchasePrice, estimatedRepairCosts, requestedLoanAmount } = req.body;
  const maxLoan = 0.75 * (Number(purchasePrice) + Number(estimatedRepairCosts));
  res.json({
    maximumLoanAmount: maxLoan,
    requestedLoanAmount: Number(requestedLoanAmount) || 0,
    canProceed: (Number(requestedLoanAmount) || 0) <= maxLoan
  });
});

app.post('/api/calculators/arv', (req, res) => {
  const { squareFootage, comparablePricePerSqft, marketAdjustment } = req.body;
  const baseARV = Number(squareFootage) * comparablePricePerSqft;
  const adjustment = baseARV * (Number(marketAdjustment) || 0) / 100;
  res.json({
    baseARV: baseARV,
    adjustedARV: baseARV + adjustment
  });
});

app.post('/api/calculators/project-metrics', (req, res) => {
  const { purchasePrice, estimatedRepairCosts, estimatedARV, closingCosts } = req.body;
  const totalInvestment = purchasePrice + estimatedRepairCosts + closingCosts;
  const profitMargin = estimatedARV - totalInvestment;
  const roiPercentage = (profitMargin / totalInvestment) * 100;
  res.json({
    totalInvestment,
    profitMargin,
    roiPercentage,
    recommended: roiPercentage >= 15
  });
});

app.post('/api/calculators/payment-schedule', (req, res) => {
  const { loanAmount, interestRate, termInMonths } = req.body;
  const monthlyRate = (interestRate / 100) / 12;
  const monthlyPayment = loanAmount * (
    monthlyRate * Math.pow(1 + monthlyRate, termInMonths) / 
    (Math.pow(1 + monthlyRate, termInMonths) - 1)
  );
  const totalPayment = monthlyPayment * termInMonths;
  const totalInterest = totalPayment - loanAmount;
  res.json({
    monthlyPayment,
    totalInterest,
    totalPayment
  });
});

app.get('/api/messages', (req, res) => {
  res.json({ messages: [] });
});

app.listen(port, () => {
  console.log(`🚀 Mock server running on http://localhost:${port}`);
  console.log('💡 This is for frontend testing only. No database connected.');
  console.log('📝 Test credentials: test@example.com / any password');
});
