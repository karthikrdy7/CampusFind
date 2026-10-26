const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`CampusFind API listening on http://localhost:${PORT}`);
});

const mongoose = require("mongoose");

let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }
  next();
});