import pool from '../../db/index.js'

export const approveAppointment = async (appointment_id) => {
  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET status = $1 
       WHERE appointment_id = $2  
         AND status = $3 
       RETURNING *`,
      ["approved", appointment_id, "pending"]
    );
    console.log(result.rows[0]);
    if (result.rowCount === 0) {
      return {
        success: false,
        message: "No pending appointments found.",
      };
    }
    const { appointment_date, appointment_time, doctor_id, user_email } = result.rows[0];
    console.log("email id is :",user_email);
    return {
      success: true,
      message: "Appointment approved.",
      appointment_date,
      appointment_time,
      doctor_id,
      user_email
    };
  } catch (err) {
    console.error("Error in approveAppointment:", err);
    return {
      success: false,
      message: "Error in approving appointment.",
    };
  }
};

export const updateSameTimeAppointments = async (appointment_date, appointment_time, doctor_id) => {
  try {
    const result = await pool.query(
      `UPDATE appointments 
       SET status = $1 
       WHERE appointment_date = $2 
         AND appointment_time = $3 
         AND status = $4 
         AND doctor_id = $5
       RETURNING *`,
      ["declined", appointment_date, appointment_time, "pending", doctor_id]
    );

    console.log(`${result.rowCount} conflicting appointment(s) declined.`);
    return {
      success: true,
      message: `${result.rowCount} conflicting appointment(s) declined.`,
    };
  } catch (err) {
    console.error("Error updating conflicting appointments:", err);
    return {
      success: false,
      message: "Error updating conflicting appointments.",
    };
  }
};

export const declineAppointment = async (appointment_id)=>{
    try{
        const result = await pool.query('update appointments set status = $1 where appointment_id = $2',['declined',appointment_id]);
        if(result.rowCount === 0){
            return{
                success:false,
                error:'appointment not found'
            }
        }
        return{
            success:true,
            data:result.rows[0]
        }
    }
    catch (err) {
        console.error('error in declineAppointment', err)
        return {
            success:false,
            error:err.message
        }
    }
}

export const addDoctor = async(doctor_data)=>{
  try{
    console.log('inside doctor');
    
      const{doc_name,gender,specialization,description,location,rating,degree,experience}=doctor_data;
      console.log(doc_name,gender,specialization,description,location,rating,degree,experience);
      
  const result = await pool.query(`insert into doctor(doc_name,gender,specialization,description,location,rating,degree,experience) values($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
      [doc_name,gender,specialization,description,location,rating,degree,experience]
  )
  console.log(result.rows.length);
  
  if(result.rows.length > 0){
    console.log('inside if');
    
      return{
          success:true,
          data: result.rows
      }
  }
  else{
    console.log('inside else');
      return{
          success:false,
          error:'not found'
      }
  }
  }
  catch(err){
      console.error('error in addDoctor', err)
      return {
          success:false,
          error:err.message
      }
  }   
}


export const deleteDoctor = async(doctor_id)=>{
  try{
      const result = await pool.query('delete from doctor where doc_id = $1',[doctor_id]);
      if(result.rowCount === 0){
          return{
              success:false,
              error:'doctor not found'
          }
      }
      return{
          success:true,
          data:result.rows[0]
      }
  }
  catch (err) {
      console.error('error in deleteDoctor', err)
      return {
          success:false,
          error:err.message
      }
  }
}


export const getAllAppointment = async()=>{
  try{
    const result = await pool.query(
      `select a.*, b.user_name, c.doc_name
      from appointments as a
      join users as b on b.email = a.user_email
      join doctor as c on a.doctor_id = c.doc_id`,
      []
    );

    return{
      success:true,
      data:result.rows,
    };
  }
  catch(err){
    console.error("database error: ", err);
    return{
      success: false,
      message:"error in finding appointment details"
    }
  }
};