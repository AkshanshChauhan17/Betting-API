const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/generate-result", (req, res) => {
    const winning_number = Math.floor(Math.random() * 10) + 1;

    db.query("SELECT COALESCE(MAX(race_number), 0) + 1 AS next_race FROM results", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const race_number = result[0].next_race;

        db.query("INSERT INTO results (race_number, winning_number) VALUES (?, ?)", [race_number, winning_number], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            const winning_type = winning_number % 2 === 0 ? "EVEN" : "ODD";
            const size_type = winning_number > 5 ? "BIG" : "SMALL";

            db.query(
                "UPDATE bets SET result = 'WIN' WHERE (bet_type = ? OR bet_type = ?) AND result = 'PENDING'", [winning_type, size_type],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    console.table()

                    db.query(
                        "SELECT user_id, SUM(bet_amount * 1.97) AS winnings FROM bets WHERE result = 'PENDING' AND race_number GROUP BY user_id",
                        (err, winners) => {
                            if (err) return res.status(500).json({ error: err.message });

                            if (winners.length > 0) {
                                winners.forEach((winner) => {
                                    db.query(
                                        "UPDATE users SET balance = balance + ? WHERE id = ?", [winner.winnings, winner.user_id],
                                        (err) => {
                                            if (err) return res.status(500).json({ error: err.message });
                                        }
                                    );
                                });
                            }

                            db.query("UPDATE bets SET result = 'LOSE' WHERE result = 'PENDING'", (err) => {
                                if (err) return res.status(500).json({ error: err.message });
                                res.json({ message: "Race result generated!", winning_number });
                            });
                        }
                    );
                }
            );
        });
    });
});

module.exports = router;