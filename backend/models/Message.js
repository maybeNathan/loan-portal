import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', messageSchema);
