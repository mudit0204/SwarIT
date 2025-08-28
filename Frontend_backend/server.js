const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nikunj:1234@cluster0.djsjf.mongodb.net/hackwave?retryWrites=true&w=majority&appName=cluster0";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/summaries', summaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});