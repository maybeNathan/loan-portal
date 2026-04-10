import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LoanApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    applicantName: '',
    propertyAddress: { street: '', city: '', state: 'KS', zip: '' },
    purchasePrice: '',
    estimatedRepairCosts: '',
    estimatedARV: '',
    downPayment: '',
    loanAmount: '',
    propertyType: 'single_family',
    experienceLevel: 'first_time',
    renovationDuration: 6,
    purchaseDate: ''
  });

  const states = ['KS', 'MO', 'TX', 'GA'];
  const propertyTypes = [
    { value: 'single_family', label: 'Single Family' },
    { value: 'multi_family', label: 'Multi-Family' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhome', label: 'Townhome' }
  ];
  const experienceLevels = [
    { value: 'first_time', label: 'First Time Investor' },
    { value: '1-3_projects', label: '1-3 Projects' },
    { value: '3-10_projects', label: '3-10 Projects' },
    { value: '10_plus_projects', label: '10+ Projects' }
  ];

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, propertyAddress: { ...formData.propertyAddress, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const loanData = {
      ...formData,
      propertyAddress: {
        ...formData.propertyAddress,
        street: formData.propertyAddress.street,
        city: formData.propertyAddress.city,
        state: formData.propertyAddress.state,
        zip: formData.propertyAddress.zip || ''
      },
      purchasePrice: Number(formData.purchasePrice),
      estimatedRepairCosts: Number(formData.estimatedRepairCosts),
      estimatedARV: Number(formData.estimatedARV),
      downPayment: Number(formData.downPayment),
      loanAmount: Number(formData.loanAmount),
      renovationDuration: parseInt(formData.renovationDuration)
    };

    try {
      const res = await api.post('/loans', loanData);
      setSuccess('Application created successfully!');
      setTimeout(() => navigate(`/loans/${res.data.loan._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <h1>New Loan Application</h1>
          <p>Create a new fix & flip loan application</p>
        </div>
      </header>

      <main className="container">
        <div style={{ maxWidth: '800px' }}>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <section className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-200)' }}>Applicant Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Property State</label>
                  <select
                    name="state"
                    value={formData.propertyAddress.state}
                    onChange={handlePropertyChange}
                    required
                  >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Investment Experience</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    required
                  >
                    {experienceLevels.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-200)' }}>Property Details</h3>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.propertyAddress.street}
                  onChange={handlePropertyChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.propertyAddress.city}
                    onChange={handlePropertyChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.propertyAddress.zip}
                    onChange={handlePropertyChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  required
                >
                  {propertyTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </section>

            <section className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-200)' }}>Financial Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Price</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Est. Repair Costs</label>
                  <input
                    type="number"
                    value={formData.estimatedRepairCosts}
                    onChange={(e) => setFormData({ ...formData, estimatedRepairCosts: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <small>Include all renovation costs</small>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>After Repair Value (ARV)</label>
                  <input
                    type="number"
                    value={formData.estimatedARV}
                    onChange={(e) => setFormData({ ...formData, estimatedARV: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <small>Estimated market value after repairs</small>
                </div>
                <div className="form-group">
                  <label>Down Payment</label>
                  <input
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Requesting Loan Amount</label>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </section>

            <section className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--gray-200)' }}>Timeline</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Planned Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Est. Renovation Duration (months)</label>
                  <input
                    type="number"
                    value={formData.renovationDuration}
                    onChange={(e) => setFormData({ ...formData, renovationDuration: e.target.value })}
                    min="1"
                    max="24"
                    required
                  />
                </div>
              </div>
            </section>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Creating...' : 'Create Application'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoanApplication;
