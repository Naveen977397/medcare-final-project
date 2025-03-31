import express from 'express';

import {bookAppointment} from '../services/appointmentService.js';
import { authenticateUser } from '../middlewares/middleware.js';

const router = express.Router();

router.post('/',authenticateUser, async (req, res) => {
    try{
        const user_email = req.user.email;
        const{ doctor_id, date, time, consultationType} = req.body;
        console.log('requesst body ', req.body);
        const appointmentData = {user_email, doctor_id, appointment_date:date, appointment_time:time, consultation_type:consultationType};
        const response = await bookAppointment(appointmentData);
        if(response.success){
            return res.status(200).send({data : response.data});
        }
        else throw new Error('error in booking appointment');
    }
    catch (err) {
        console.error("error occured", err.message);
        return res.status(400).send({message : err.message || "unknown error"});
    }
});

export default router;