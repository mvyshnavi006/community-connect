require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// CORS — allow frontend origin (set FRONTEND_URL env var in production)
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  process.env.FRONTEND_URL, // e.g. https://community-connect.netlify.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth",        require("./routes/auth"));
app.use("/api/services",    require("./routes/services"));
app.use("/api/emergencies", require("./routes/emergencies"));
app.use("/api/lost",        require("./routes/lost"));
app.use("/api/found",       require("./routes/found"));
app.use("/api/events",      require("./routes/events"));

// Health check
app.get("/", (req, res) => res.json({ message: "Community Connect API is running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
