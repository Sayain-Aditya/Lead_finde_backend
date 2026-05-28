require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const leadsRouter = require("./routes/leads");
const mapsRouter  = require("./routes/maps");
const pitchRouter = require("./routes/pitch");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

// Routes
app.use("/leads", leadsRouter);
app.use("/pitch", pitchRouter);
app.use("/", mapsRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
