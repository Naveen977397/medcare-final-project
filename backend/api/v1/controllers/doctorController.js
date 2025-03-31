import express from 'express';
import { getAllDoctors } from '../services/doctorServices.js';

import { getDoctorById } from '../services/doctorServices.js';


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await getAllDoctors();
        if(response.success){
            return res.status(200).send({data : response.data});
        }else throw new Error('error in getting doctors');
    } catch (err) {
        console.error("get api controller error", err.message);
        return res.status(400).send({message : err.message || "unknown error"});
    }
});



router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params ;
        const response = await getDoctorById(id);
        if(response.success){
            return res.status(200).send({data : response.data});
        }else throw new Error('error in getting doctor by id');
    } catch (err) {
        console.error("get api controller error", err.message);
        return res.status(400).send({message : err.message || "unknown error"});
    }
});
export default router;


