require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());

console.log("ADMIN ROUTES LOADED");

const connectDB = require("./config/db");

require("./cron/planExpiry");

connectDB();

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
    res.send("Backend is running 🚀!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

});