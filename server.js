const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://carduser:cQGtChlVCuaUtiCK@digitalcardsender.sxecr.mongodb.net/digitalcards?retryWrites=true&w=majority&appName=DigitalCardSender', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Card = mongoose.model('Card', {
  id: String,
  recipient: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

// Create a new card
app.post('/create', async (req, res) => {
  const card = new Card({
    id: Math.random().toString(36).substr(2, 9),
    recipient: req.body.recipient,
    message: req.body.message
  });
  await card.save();
  const link = `${req.protocol}://${req.get('host')}/card/${card.id}`;
  res.json({ link });
});

// Serve card data
app.get('/card/:id', async (req, res) => {
  const card = await Card.findOne({ id: req.params.id });
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ error: 'Card not found' });
  }
});

// Serve card viewer
app.get('/card/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'card.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));