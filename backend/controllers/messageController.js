import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { loanId, receiverId, content, attachments } = req.body;

    const message = new Message({
      loan: loanId,
      sender: req.user._id,
      receiver: receiverId,
      content,
      attachments: attachments || []
    });

    await message.save();

    res.status(201).json({ 
      message: 'Message sent successfully',
      message: message 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { loanId } = req.query;

    let query = {
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    };

    if (loanId) {
      query.loan = loanId;
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        read: true 
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
