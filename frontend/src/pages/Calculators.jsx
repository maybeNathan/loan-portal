import React, { useState } from 'react';
import api from '../utils/api';

const Calculators = () => {
  const [activeCalc, setActiveCalc] = useState('loan-amount');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <h1>Fix & Flip Calculators</h1>
          <p>Calculate loan amounts, project metrics, and more</p>
        </div>
      </header>

      <main className="container">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--gray-200)' }}>
          {[
            { id: 'loan-amount', label: 'Loan Amount' },
            { id: 'project-metrics', label: 'Project ROI' },
            { id: 'arv', label: 'ARV Calculator' },
            { id: 'payment', label: 'Payment Schedule' }
          ].map(calc => (
            <button
              key={calc.id}
              onClick={() => { setActiveCalc(calc.id); setShowResults(false); setError(''); }}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeCalc === calc.id ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeCalc === calc.id ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: activeCalc === calc.id ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              {calc.label}
            </button>
          ))}
        </div>

        {activeCalc === 'loan-amount' && <LoanAmountCalculator onCalculate={() => setShowResults(true)} />}
        {activeCalc === 'project-metrics' && <ProjectMetricsCalculator onCalculate={() => setShowResults(true)} />}
        {activeCalc === 'arv' && <ARVCalculator onCalculate={() => setShowResults(true)} />}
        {activeCalc === 'payment' && <PaymentCalculator onCalculate={() => setShowResults(true)} />}
      </main>
    </div>
  );
};

const LoanAmountCalculator = ({ onCalculate }) => {
  const [formData, setFormData] = useState({ purchasePrice: '', downPayment: '', estimatedRepairCosts: '' });
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await api.post('/calculators/loan-amount', {
        purchasePrice: Number(formData.purchasePrice),
        downPayment: Number(formData.downPayment),
        estimatedRepairCosts: Number(formData.estimatedRepairCosts)
      });
      setResult(res.data);
      onCalculate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h3>Loan Amount Calculator</h3>
      <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Calculate your maximum loan amount based on purchase price and repair costs.</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Purchase Price</label>
          <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} placeholder="100000" />
        </div>
        <div className="form-group">
          <label>Down Payment</label>
          <input type="number" value={formData.downPayment} onChange={(e) => setFormData({...formData, downPayment: e.target.value})} placeholder="20000" />
        </div>
        <div className="form-group">
          <label>Est. Repair Costs</label>
          <input type="number" value={formData.estimatedRepairCosts} onChange={(e) => setFormData({...formData, estimatedRepairCosts: e.target.value})} placeholder="30000" />
        </div>
      </div>
      
      <button onClick={handleCalculate} className="btn btn-primary">Calculate</button>

      {result && showResults && (
        <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
          <h4>Results</h4>
          <p>Maximum Loan Amount: <strong>${result.maximumLoanAmount.toLocaleString()}</strong></p>
          <p>Requested Loan Amount: <strong>${result.requestedLoanAmount.toLocaleString()}</strong></p>
          <p style={{ color: result.canProceed ? 'var(--secondary)' : 'var(--danger)' }}>
            {result.canProceed ? '✓ Proceed - Loan amount within limits' : '✗ Loan amount exceeds 75% LTV limit'}
          </p>
        </div>
      )}
    </div>
  );
};

const ProjectMetricsCalculator = ({ onCalculate }) => {
  const [formData, setFormData] = useState({ purchasePrice: '', estimatedRepairCosts: '', estimatedARV: '', closingCosts: '2500' });
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await api.post('/calculators/project-metrics', {
        purchasePrice: Number(formData.purchasePrice),
        estimatedRepairCosts: Number(formData.estimatedRepairCosts),
        estimatedARV: Number(formData.estimatedARV),
        closingCosts: Number(formData.closingCosts)
      });
      setResult(res.data);
      onCalculate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h3>Project ROI Calculator</h3>
      <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Calculate your return on investment for the fix & flip project.</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Purchase Price</label>
          <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Est. Repair Costs</label>
          <input type="number" value={formData.estimatedRepairCosts} onChange={(e) => setFormData({...formData, estimatedRepairCosts: e.target.value})} />
        </div>
        <div className="form-group">
          <label>ARV</label>
          <input type="number" value={formData.estimatedARV} onChange={(e) => setFormData({...formData, estimatedARV: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Closing Costs</label>
          <input type="number" value={formData.closingCosts} onChange={(e) => setFormData({...formData, closingCosts: e.target.value})} />
        </div>
      </div>
      
      <button onClick={handleCalculate} className="btn btn-primary">Calculate ROI</button>

      {result && showResults && (
        <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
          <h4>Project Metrics</h4>
          <p>Total Investment: <strong>${result.totalInvestment.toLocaleString()}</strong></p>
          <p>Profit Margin: <strong>${result.profitMargin.toLocaleString()}</strong></p>
          <p>ROI: <strong>{result.roiPercentage}%</strong></p>
          <p style={{ color: result.recommended ? 'var(--secondary)' : 'var(--warning)' }}>
            {result.recommended ? '✓ This project has a healthy ROI (>=15%)' : '⚠ ROI below recommended 15%'}
          </p>
        </div>
      )}
    </div>
  );
};

const ARVCalculator = ({ onCalculate }) => {
  const [formData, setFormData] = useState({ squareFootage: '', comparablePricePerSqft: '', marketAdjustment: '0' });
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await api.post('/calculators/arv', formData);
      setResult(res.data);
      onCalculate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h3>ARV Calculator</h3>
      <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Calculate After Repair Value based on comparable properties.</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Square Footage</label>
          <input type="number" value={formData.squareFootage} onChange={(e) => setFormData({...formData, squareFootage: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Comparable $/Sq Ft</label>
          <input type="number" value={formData.comparablePricePerSqft} onChange={(e) => setFormData({...formData, comparablePricePerSqft: e.target.value})} step="0.01" />
        </div>
        <div className="form-group">
          <label>Market Adjustment %</label>
          <input type="number" value={formData.marketAdjustment} onChange={(e) => setFormData({...formData, marketAdjustment: e.target.value})} placeholder="0 for no adjustment" />
        </div>
      </div>
      
      <button onClick={handleCalculate} className="btn btn-primary">Calculate ARV</button>

      {result && showResults && (
        <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
          <h4>ARV Results</h4>
          <p>Base ARV: <strong>${result.baseARV.toLocaleString()}</strong></p>
          <p>Adjusted ARV: <strong>${result.adjustedARV.toLocaleString()}</strong></p>
        </div>
      )}
    </div>
  );
};

const PaymentCalculator = ({ onCalculate }) => {
  const [formData, setFormData] = useState({ loanAmount: '', interestRate: '10', termInMonths: '12' });
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await api.post('/calculators/payment-schedule', formData);
      setResult(res.data);
      onCalculate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h3>Payment Schedule Calculator</h3>
      <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Calculate monthly payments and total interest.</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Loan Amount</label>
          <input type="number" value={formData.loanAmount} onChange={(e) => setFormData({...formData, loanAmount: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Interest Rate %</label>
          <input type="number" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})} step="0.1" />
        </div>
        <div className="form-group">
          <label>Term (Months)</label>
          <input type="number" value={formData.termInMonths} onChange={(e) => setFormData({...formData, termInMonths: e.target.value})} />
        </div>
      </div>
      
      <button onClick={handleCalculate} className="btn btn-primary">Calculate Payments</button>

      {result && showResults && (
        <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
          <h4>Payment Schedule</h4>
          <p>Monthly Payment: <strong>${result.monthlyPayment.toFixed(2)}</strong></p>
          <p>Total Interest: <strong>${result.totalInterest.toFixed(2)}</strong></p>
          <p>Total Payment: <strong>${result.totalPayment.toFixed(2)}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Calculators;
