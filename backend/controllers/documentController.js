import multer from 'multer';
import path from 'path';
import Document from '../models/Document.js';
import Loan from '../models/Loan.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (ext && mimeType) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

export const uploadDocument = [
  (req, res, next) => upload.single('file')(req, res, next),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { loanId, type, notes } = req.body;

      const loan = await Loan.findById(loanId);
      if (!loan || loan.applicant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const document = new Document({
        loan: loanId,
        type,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileUrl: `/api/documents/download/${req.file.filename}`,
        uploadedBy: req.user._id,
        notes
      });

      await document.save();

      res.status(201).json({
        message: 'Document uploaded successfully',
        document
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

export const getDocuments = async (req, res) => {
  try {
    const { loanId } = req.query;

    let query = {};
    if (loanId) {
      query.loan = loanId;
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ uploadedAt: -1 });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const { verified } = req.body;
    
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { verified, verifiedBy: req.user._id },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document verified', document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
