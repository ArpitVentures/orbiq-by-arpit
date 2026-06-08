const express = require("express");

const app = express();

const authRoutes =
    require("./routes/authRoutes");

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log(
        "Server started on port 3000"
    );
});