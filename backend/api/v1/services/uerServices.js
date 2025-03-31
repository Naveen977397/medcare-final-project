import pool from '../../db/index.js'
import bcrypt from 'bcryptjs';

export const createUser = async (user_name, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const response = await pool.query(query, [user_name, email, hashedPassword]);

        return response.rows[0]; 
    } catch (error) {
        console.error("Error creating user:", error);

        if (error.code === "23505") {
            throw new Error("Email already exists. Please use a different email.");
        }

        throw new Error("Internal Server Error");
    }
};

export const finduserbyEmail = async (email) => {
    try{
        const query = `select * from users where email = $1`;
        const response = await pool.query(query, [email]);
        return response.rows[0];
    }
    catch(error){
        console.log("error in find user by email");
    }
};