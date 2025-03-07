const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/place-bet", (req, res) => {
    const { token, bet_type, bet_amount } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        db.query("SELECT balance FROM users WHERE id = ?", [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (parseInt(results[0].balance) < bet_amount) return res.status(400).json({ error: "Insufficient balance" });

            db.query("UPDATE users SET balance = balance - ? WHERE id = ?", [bet_amount, userId], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                db.query("INSERT INTO bets (user_id, bet_type, bet_amount) VALUES (?, ?, ?)", [userId, bet_type, bet_amount], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Bet placed successfully!" });
                });
            });
        });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

module.exports = router;