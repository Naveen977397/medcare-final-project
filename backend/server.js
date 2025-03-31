import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import api from './api/index.js';
import passport from './api/v1/services/passport.js';
import session from 'express-session';
import pool from './api/db/index.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001"],  
    credentials: true 
}));


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, sameSite:"lax",httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/api',api);

app.post("/appointments", async (req, res) => {
    try {
        const { doctor_id, date } = req.body;

        const result = await pool.query(
            `SELECT appointment_time FROM appointments 
             WHERE doctor_id = $1 AND appointment_date = $2 AND status = 'approved'`,
            [doctor_id, date]
        );

        res.json({ success: true, bookedSlots: result.rows.map(row => row.appointment_time) });
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        res.status(500).json({ success: false, message: "Error fetching booked slots." });
    }
});

app.listen(process.env.serverPort,()=>{
    console.log(`app running on port ${process.env.serverPort}`);
});
