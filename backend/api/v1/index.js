import express from 'express';
import doctorController from './controllers/doctorController.js';
import { ensureAuthenticated } from './middlewares/middleware.js';
import appointmentController from './controllers/appointmentController.js';
import admincontroller from './controllers/admincontroller.js';
import userController from './controllers/userController.js';
import passport from 'passport';
const router = express.Router();


router.use('/doctors',doctorController);

router.use('/user',userController);

router.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

router.post('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.clearCookie('connect.sid');
        console.log('logged out');
        
        res.send({ message: 'Logged out' });
    });
});

router.get('/appoint', ensureAuthenticated, (req, res) => {
  res.json({ message: `Welcome to your appointment, ${req.user.email}` });
});

router.use('/bookAppointment', appointmentController);
  
router.use('/admin',admincontroller);

router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("http://localhost:3000/appointment");
});

export default router;

