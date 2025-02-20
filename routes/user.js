const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.get("/balance", (req, res) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        db.query("SELECT balance FROM users WHERE id = ?", [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ balance: results[0].balance });
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
