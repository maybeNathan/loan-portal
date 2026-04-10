import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loan, setLoan] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [ loanRes, docsRes, msgsRes ] = await Promise.all([
        api.get(`/loans/${id}`),
        api.get(`/documents?loanId=${id}`),
        api.get(`/messages?loanId=${id}`)
      ]);
      setLoan(loanRes.data.loan);
      setDocuments(docsRes.data.documents || []);
      setMessages(msgsRes.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      draft: 'badge-draft',
      submitted: 'badge-submitted',
      under_review: 'badge-review',
      approved: 'badge-approved',
      declined: 'badge-declined',
      funded: 'badge-funded'
    };
    return map[status] || 'badge-draft';
  };

  const formatStatus = (status) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (!loan) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loan not found</div>;

  return (
    <div>
      <header className="page-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Loan Application Details</h1>
              <p>State: {loan.propertyAddress?.state}</p>
            </div>
            <span className={`badge ${getStatusBadge(loan.status)}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {formatStatus(loan.status)}
            </span>
          </div>
        </div>
      </header>

      <main className="container">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--gray-200)' }}>
          {['details', 'documents', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <h3>Property Information</h3>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Address:</strong> {loan.propertyAddress?.street}, {loan.propertyAddress?.city}, {loan.propertyAddress?.state} {loan.propertyAddress?.zip}</p>
                <p><strong>Property Type:</strong> {loan.propertyType?.replace('_', ' ')}</p>
                <p><strong>Investor Experience:</strong> {loan.experienceLevel?.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="card">
              <h3>Financial Details</h3>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Purchase Price:</strong> ${loan.purchasePrice?.toLocaleString()}</p>
                <p><strong>Est. Repair Costs:</strong> ${loan.estimatedRepairCosts?.toLocaleString()}</p>
                <p><strong>ARV:</strong> ${loan.estimatedARV?.toLocaleString()}</p>
                <p><strong>Down Payment:</strong> ${loan.downPayment?.toLocaleString()}</p>
                <p><strong>Loan Amount:</strong> ${loan.loanAmount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="card">
              <h3>Project Timeline</h3>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Purchase Date:</strong> {loan.timeline?.purchaseDate ? new Date(loan.timeline.purchaseDate).toLocaleDateString() : 'Not specified'}</p>
                <p><strong>Renovation Duration:</strong> {loan.timeline?.renovationDuration} months</p>
                <p><strong>Created:</strong> {new Date(loan.createdAt).toLocaleDateString()}</p>
                {loan.updatedAt && <p><strong>Last Updated:</strong> {new Date(loan.updatedAt).toLocaleDateString()}</p>}
              </div>
            </div>

            {loan.status === 'draft' && user?.role === 'applicant' && (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Ready to Submit?
                  <button onClick={() => api.post(`/loans/${id}/submit`).then(() => fetchData()).then(() => navigate('/dashboard'))} className="btn btn-primary">
                    Submit Application
                  </button>
                </h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)' }}>Once submitted, the loan officer will review your application.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Upload and view documents related to this loan application.</p>
            <DocumentsTable documents={documents} loanId={id} onUpload={() => fetchData()} />
          </div>
        )}

        {activeTab === 'messages' && (
          <MessagesList messages={messages} loanId={id} />
        )}

        <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ marginTop: '2rem' }}>
          Back to Dashboard
        </button>
      </main>
    </div>
  );
};

const DocumentsTable = ({ documents, loanId, onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpload();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <input type="file" onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" disabled={uploading} />
        {uploading && <span style={{ color: 'var(--gray-600)' }}>Uploading...</span>}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)', borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>File Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Uploaded</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--gray-500)' }}>No documents uploaded</td></tr>
            )}
            {documents.map(doc => (
              <tr key={doc._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{doc.type.replace('_', ' ')}</td>
                <td style={{ padding: '0.75rem' }}>{doc.fileName}</td>
                <td style={{ padding: '0.75rem' }}>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  {doc.verified ? <span style={{ color: 'var(--secondary)' }}>Verified</span> : <span style={{ color: 'var(--warning)' }}>Pending</span>}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/documents/download?file=/uploads/${doc.filePath}`} download>Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MessagesList = ({ messages, loanId }) => {
  const [content, setContent] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await api.post('/messages', { loanId, content });
      messages.push(res.data.message);
      setContent('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr auto', height: '500px' }}>
       {messages.map(msg => (
         <div key={msg._id} className="card" style={{
           marginBottom: '1rem',
           backgroundColor: msg.sender._id === msg.receiver._id ? 'var(--gray-100)' : 'white',
           padding: '1rem'
         }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
             <strong>{msg.sender.name}</strong>
             <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
           </div>
           <p style={{ margin: 0, lineHeight: '1.5' }}>{msg.content}</p>
         </div>
       ))}
       <form onSubmit={handleSend} className="card" style={{ marginTop: 'auto' }}>
         <div style={{ display: 'flex', gap: '0.75rem' }}>
           <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type a message..." />
           <button type="submit" className="btn btn-primary">Send</button>
         </div>
       </form>
    </div>
  );
};

export default LoanDetails;
