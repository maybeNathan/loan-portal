import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['applicant', 'loan_officer', 'admin'],
    default: 'applicant'
  },
  state: {
    type: String,
    enum: ['KS', 'MO', 'TX', 'GA'],
    required: true
  },
  tfaEnabled: {
    type: Boolean,
    default: false
  },
  tfaSecret: {
    type: String
  },
  loans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
