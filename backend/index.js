const express = require('express');
const sql = require('./src/utils/sql');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/dbtest', async (_, res) => {
    try {
        const result = await sql`SELECT 1`;
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ success: false, error: 'Database query failed' });
    }
});

app.post('/add-organizer', async (req, res) => {
    console.log(req.body);
    const { organizer_name, email, phone_number, location, links } = req.body;

    if (!organizer_name || !email) {
        return res.status(400).json({ success: false, error: 'Organizer name and email are required' });
    }

    try {
        const result = await sql`
            INSERT INTO organizers (organizer_name, email, phone_number, location, links)
            VALUES (${organizer_name}, ${email}, ${phone_number}, ${location}, ${links})
            RETURNING *;
        `;

        res.json({ success: true, data: result[0] });
    } catch (error) {
        console.error('Error inserting organizer:', error);
        res.status(500).json({ success: false, error: 'Failed to add organizer' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});