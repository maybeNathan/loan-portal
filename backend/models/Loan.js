import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  propertyAddress: {
    street: String,
    city: String,
    state: {
      type: String,
      enum: ['KS', 'MO', 'TX', 'GA'],
      required: true
    },
    zip: String
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  estimatedRepairCosts: {
    type: Number,
    required: true
  },
  estimatedARV: {
    type: Number,
    required: true
  },
  downPayment: {
    type: Number,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['single_family', 'multi_family', 'condo', 'townhome'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['first_time', '1-3_projects', '3-10_projects', '10_plus_projects'],
    required: true
  },
  timeline: {
    purchaseDate: Date,
    renovationDuration: {
      type: Number,
      default: 6
    }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'declined', 'funded'],
    default: 'draft'
  },
  stateSpecific: {
    ks: {
      disclosureReceived: {
        type: Boolean,
        default: false
      }
    },
    mo: {
      preApprovalRequired: {
        type: Boolean,
        default: false
      }
    },
    tx: {
      titleCommitment: {
        type: Boolean,
        default: false
      }
    },
    ga: {
      floodZoneCheck: {
        type: Boolean,
        default: false
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

loanApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Loan', loanApplicationSchema);
