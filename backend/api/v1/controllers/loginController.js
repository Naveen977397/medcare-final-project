import express from 'express';


router.post('/',async (req,res)=>{
    console.log("inside login controller");
    console.log(req.user);
    if(req.user){
        return res.status(200).send({message : 'login success'});
    }else{
        return res.status(400).send({message : 'login failed'});
    }
});