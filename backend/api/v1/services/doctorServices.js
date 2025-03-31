import pool from '../../db/index.js'

export const getAllDoctors = async () => {
    try {
        const result = await pool.query('SELECT * FROM doctor');
        console.log("query response",result);
        return{
            success: true,
            data: result.rows
        };
    } catch (err) {
        console.log("error in select query",err);
        return{
            success: false,
            error:err.message
        }
    }
};


export const getDoctorById = async (id) => {
    try {
        const result =  await pool.query('select * from doctor where doc_id = $1',
            [id]
        )
        return {
            success:true,
            data:result.rows[0]
        }
        
    } catch (err) {
        console.error('error in getDoctorById', err)
        return {
            success:false,
            error:err.message
        }
    }
}

