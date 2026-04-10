# Fix & Flip Loan Broker Customer Portal

A comprehensive customer portal for fix & flip loan brokers operating in **Kansas, Missouri, Texas, and Georgia**.

## Features

### Authentication & Security
- User registration and login
- Two-factor authentication (2FA) support
- Role-based access (applicant, loan officer, admin)
- JWT token authentication

### Loan Applications
- Create and manage fix & flip loan applications
- State-specific compliance fields for KS, MO, TX, GA
- Track application status (draft, submitted, under_review, approved, declined, funded)
- Real-time status updates

### Document Management
- Secure document upload and storage
- Support for PDF, images, and document files
- Document verification by loan officers
- Organized by loan application

### Messaging System
- Direct messaging between applicants and loan officers
- Message history per loan application
- Unread message count notifications
- Support for file attachments

### Financial Calculators
- **Loan Amount Calculator** - Calculate maximum loan based on purchase price and repair costs
- **Project ROI Calculator** - Calculate ROI and profit margins
- **ARV Calculator** - Estimate After Repair Value
- **Payment Schedule Calculator** - Calculate monthly payments and interest

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Multer for file uploads
- Helmet for security headers

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Custom CSS styling with professional design

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Git

### Installation

1. **Clone or navigate to the project directory:**
```bash
cd fix-flip-portal
```

2. **Install dependencies:**
```bash
# Install root dependencies (optional - for concurrent scripts)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables:**

Backend (`.env` in `/backend`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fix-flip-portal
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
FRONTEND_URL=http://localhost:3000
```

Frontend (`.env` in `/frontend`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start MongoDB:**
```bash
# Ensure MongoDB is running
mongod
```

5. **Start the application:**

**Option A - Run both servers concurrently:**
```bash
cd fix-flip-portal
npm run setup  # First time setup
npm run dev   # Run both frontend and backend
```

**Option B - Run servers separately:**

Terminal 1 (Backend):
```bash
cd fix-flip-portal/backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd fix-flip-portal/frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/setup-tfa` - Setup 2FA
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Loans
- `POST /api/loans` - Create loan application
- `GET /api/loans/my-loans` - Get user's loan applications
- `GET /api/loans/:id` - Get specific loan details
- `PUT /api/loans/:id` - Update loan application
- `POST /api/loans/:id/submit` - Submit loan application
- `PUT /api/loans/:id/status` - Update loan status (loan officer)

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - Get documents (optionally by loanId)
- `PUT /api/documents/:id/verify` - Verify document
- `DELETE /api/documents/:id` - Delete document

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get messages (optionally by loanId)
- `PUT /api/messages/:id/read` - Mark message as read
- `GET /api/messages/unread-count` - Get unread message count

### Calculators
- `POST /api/calculators/loan-amount` - Calculate loan amount
- `POST /api/calculators/project-metrics` - Calculate project ROI
- `POST /api/calculators/arv` - Calculate ARV
- `POST /api/calculators/payment-schedule` - Calculate payment schedule

## State-Specific Compliance

The portal includes state-specific fields for each supported state:

- **Kansas (KS)**: Disclosure received checkbox
- **Missouri (MO)**: Pre-approval required checkbox
- **Texas (TX)**: Title commitment checkbox
- **Georgia (GA)**: Flood zone check checkbox

## Usage Guide

### For Applicants

1. **Register** with your email, password, and state
2. **Login** to your account
3. View your **dashboard** with all loan applications
4. **Create new loan application** with property and financial details
5. **Upload documents** (contracts, estimates, etc.)
6. **Communicate** with loan officers via messaging
7. Use **calculators** to estimate project metrics
8. **Submit application** for review

### For Loan Officers/Admin

1. View all loan applications
2. Update application status
3. Verify uploaded documents
4. Send messages to applicants
5. Approve or decline applications

## Development Guidelines

### Adding New Features

1. Create controller in `/backend/controllers/`
2. Create routes in `/backend/routes/`
3. Add corresponding React component in `/frontend/src/pages/` or `/frontend/src/components/`
4. Update routing in `/frontend/src/App.jsx`

### Database Models

Located in `/backend/models/`:
- `User.js` - User authentication and profile
- `Loan.js` - Loan applications with state-specific fields
- `Document.js` - Uploaded documents
- `Message.js` - Messaging system

## Support

For issues or questions, please create an issue in the repository.

## License

MIT License - Feel free to use and modify for your business needs.
