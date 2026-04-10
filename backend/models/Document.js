import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  type: {
    type: String,
    enum: [
      'bank_statement',
      'w2',
      'tax_return',
      'purchase_contract',
      'repair_estimates',
      'comparable_sales',
      'insurance',
      'appraisal',
      'id_verification',
      'other'
    ],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Document', documentSchema);
