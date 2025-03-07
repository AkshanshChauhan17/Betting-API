const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.get("/info", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        db.query("SELECT id, username, balance FROM users WHERE id = ?", [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ user_info: results[0] });
        });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

router.get("/results", (req, res) => {
    db.query("SELECT * FROM results ORDER BY id DESC LIMIT 10", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;