const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/users', async(req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id/balance', async(req, res) => {
    try {
        const { balance } = req.body;
        const { id } = req.params;
        await db.query('UPDATE users SET balance = ? WHERE id = ?', [balance, id]);
        res.json({ message: 'User balance updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/bets', async(req, res) => {
    try {
        const [bets] = await db.query('SELECT * FROM bets');
        res.json(bets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/bets/:id/result', async(req, res) => {
    try {
        const { result } = req.body;
        const { id } = req.params;
        await db.query('UPDATE bets SET result = ? WHERE id = ?', [result, id]);
        res.json({ message: 'Bet result updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/bets/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM bets WHERE id = ?', [id]);
        res.json({ message: 'Bet deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/results', async(req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM results');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/results', async(req, res) => {
    try {
        const { race_number, winning_number } = req.body;
        await db.query('INSERT INTO results (race_number, winning_number) VALUES (?, ?)', [race_number, winning_number]);
        res.json({ message: 'Race result added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/results/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM results WHERE id = ?', [id]);
        res.json({ message: 'Race result deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/dashboard/stats', async(req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as total_users FROM users');
        const [betCount] = await db.query('SELECT COUNT(*) as total_bets FROM bets');
        const [totalBalance] = await db.query('SELECT SUM(balance) as total_balance FROM users');
        res.json({
            total_users: userCount[0].total_users,
            total_bets: betCount[0].total_bets,
            total_balance: totalBalance[0].total_balance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;