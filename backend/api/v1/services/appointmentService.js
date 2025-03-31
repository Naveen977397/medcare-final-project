import pool from '../../db/index.js'

export const bookAppointment = async (appointmentData)=>{
    const{user_email, doctor_id, appointment_date, appointment_time, consultation_type} = appointmentData;
    const values= [user_email, doctor_id, appointment_date, appointment_time, consultation_type];
    try{
        const result = await pool.query('insert into appointments(user_email, doctor_id, appointment_date, appointment_time, consultation_type) values($1,$2,$3,$4,$5)',values);
        return{
            success:true,
            data:result.rows[0]
        }
    }
    catch (err) {
        console.error('error in bookAppointment', err)
        return {
            success:false,
            error:err.message
        }
    }
}