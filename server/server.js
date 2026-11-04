const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`CampusFind API listening on http://localhost:${PORT}`);
});

const cors = require("cors");

app.use(cors({
    origin: "https://campusfind-hu7x.onrender.com"
}))