const app = require('./src/app');
const { PORT } = require('./src/config/env');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
