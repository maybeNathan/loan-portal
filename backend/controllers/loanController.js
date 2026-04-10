import Loan from '../models/Loan.js';

export const createLoanApplication = async (req, res) => {
  try {
    const loanData = {
      ...req.body,
      applicant: req.user._id,
      status: 'draft'
    };

    const loan = new Loan(loanData);
    await loan.save();

    req.user.loans.push(loan._id);
    await req.user.save();

    res.status(201).json({ message: 'Loan application created', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ applicant: req.user._id })
      .populate('applicant', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('applicant', 'name email');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (
      loan.applicant._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: 'Loan application updated', loan: updatedLoan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    loan.status = 'submitted';
    await loan.save();

    res.json({ message: 'Loan application submitted', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('applicant', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const { status } = req.body;
    
    loan.status = status;
    await loan.save();

    res.json({ message: 'Loan status updated', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
