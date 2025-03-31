import express from 'express';
import { approveAppointment, declineAppointment, updateSameTimeAppointments, addDoctor, deleteDoctor, getAllAppointment} from '../services/adminServices.js';
import { confirmation } from "../services/emailService.js";
import pool from "../../db/index.js";
import dotenv from "dotenv"

const router = express.Router();

router.post("/approve", async (req, res) => {
  try {
    const { appointment_id } = req.body;

    const response = await approveAppointment(appointment_id);

    if (!response.success) {
      throw new Error("Error in approving appointment");
    }

    const { appointment_date, appointment_time, doctor_id, user_email } = response;

    console.log(appointment_date, appointment_time, doctor_id,user_email);

    const doctorRes = await pool.query(
      `SELECT doc_name FROM doctor WHERE doc_id = $1`,
      [doctor_id]
    );
    const doctorName = doctorRes.rows[0]?.doc_name || "Unknown Doctor";
    console.log(doctorName);
    console.log(user_email);

    if (user_email) {
      console.log(`Sending email to: ${user_email}`);
      await confirmation(user_email, doctorName, appointment_time,appointment_date);
    }

    const result = await updateSameTimeAppointments(appointment_date, appointment_time, doctor_id);
    
    if (!result.success) {
      throw new Error("Error in updating conflicting appointments");
    }

    console.log("Updated conflicting appointments:", result.data);
    return res.status(200).json({ message: "Appointment approved and email sent", data: response });

  } catch (err) {
    console.error("Error occurred:", err.message);
    return res.status(400).json({ message: err.message || "Unknown error" });
  }
});


//decline appointment
router.post('/decline', async (req, res) => {
    try {
        const { appointment_id } = req.body;
        const response = await declineAppointment(appointment_id);
        if(response.success){
            return res.status(200).send({data : response.data});
        }else throw new Error('error in declining appointment');
    } catch (err) {
        console.error("error occured", err.message);
        return res.status(400).send({message : err.message || "unknown error"});
    }
});

//add doctor
router.post('/add', async (req, res) => {
  try {
    console.log('inside add doc controller');
    
      const doctor_data = req.body;
      const response = await addDoctor(doctor_data);
      if(response.success){
          return res.status(200).send({data : response.data});
      }else throw new Error('error in adding doctor');
  } catch (err) {
      console.error("error occured", err.message);
      return res.status(400).send({message : err.message || "unknown error"});
  }
});

//delete doctor
router.delete('/delete', async (req, res) => {
  try {
      const {doc_id} = req.body;
      const response = await deleteDoctor(doc_id);
      if(response.success){
          return res.status(200).send({data : response.data});
      }else throw new Error('error in deleting doctor');
  } catch (err) {
      console.error("error occured", err.message);
      return res.status(400).send({message : err.message || "unknown error"});
  }
});


router.get('/appointments', async(req,res)=>{
  try{
    const result = await getAllAppointment();
    if(result.success){
      res.status(200).json(
        {
          success: true,
          data:result.data,
        }
      )
    }else throw new Error('error in get api')
  } catch(err){
    return res.status(500).json({message:err.message});
  }
});


dotenv.config();

router.post("/adminlogin", (req, res) => {
  const { adminKey } = req.body;
  
  if (adminKey === process.env.ADMIN_SECRET_KEY) {
    req.session.isAdmin = true;
    res.json({ success: true, message: "Admin logged in" });
  } else {
    res.status(401).json({ success: false, message: "Invalid key" });
  }
});

router.get("/adminlogout", (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.json({ success: true, message: "Logged out" });
});

router.get("/check", (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

export default router;

