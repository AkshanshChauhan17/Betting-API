const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/generate-result", (req, res) => {
    const winning_number = Math.floor(Math.random() * 10) + 1;
    const winning_type = winning_number % 2 === 0 ? "EVEN" : "ODD";

    console.log("Winning Number:", winning_number, "Winning Type:", winning_type);

    db.query("SELECT COALESCE(MAX(race_number), 0) + 1 AS next_race FROM results", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const race_number = result[0].next_race;

        db.query("INSERT INTO results (race_number, winning_number) VALUES (?, ?)", [race_number, winning_number], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query("SELECT * FROM bets WHERE result = 'PENDING'", (err, bets) => {
                if (err) return res.status(500).json({ error: err.message });
                bets.forEach((bet) => {
                    if (winning_type === bet.bet_type) {
                        db.query("UPDATE users SET balance = balance + ? WHERE id = ?", [(bet.bet_amount * 1.9), bet.user_id], (err) => {
                            if (err) return res.status(500).json({ error: err.message });
                            db.query("UPDATE bets SET result = 'WIN' WHERE result = 'PENDING'", (err) => {
                                if (err) return res.status(500).json({ error: err.message });
                            })
                        })
                    } else {
                        db.query("UPDATE bets SET result = 'LOSE' WHERE result = 'PENDING'", (err) => {
                            if (err) return res.status(500).json({ error: err.message });
                        })
                    }
                })
                return res.json({ message: "Race result generated!", winning_number });
            })
        });

    });
});

module.exports = router;