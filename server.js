const express = require("express");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const betRoutes = require("./routes/bet");
const resultRoutes = require("./routes/result");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/bet", betRoutes);
app.use("/result", resultRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
