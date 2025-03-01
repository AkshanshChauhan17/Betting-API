const express = require("express");
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const betRoutes = require("./routes/bet");
const resultRoutes = require("./routes/result");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});