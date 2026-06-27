require("dotenv").config();

const express = require("express");
const app = express();

console.log("ADMIN ROUTES LOADED");

const connectDB = require("./config/db");

require("./cron/planExpiry");

connectDB();

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});