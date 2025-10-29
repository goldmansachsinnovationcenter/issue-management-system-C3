const express = require('express');
const cors = require('cors');
const issueRoutes = require('./routes/issueRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/issues', issueRoutes);
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Issue Management System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
