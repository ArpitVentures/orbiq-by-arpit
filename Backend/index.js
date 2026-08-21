const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log("DNS Servers:", dns.getServers());

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

console.log("ADMIN ROUTES LOADED");

const connectDB = require("./config/db");

require("./cron/planExpiry");

connectDB();

app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
app.use("/horizon", require("./routes/horizonRoutes"));

app.get("/", (req, res) => {
    res.send("Backend is running 🥳!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});