import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import { finduserbyEmail } from "./uerServices.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from '../../db/index.js'
import dotenv from 'dotenv'

dotenv.config()
passport.use(new LocalStrategy({
    usernameField: 'email',
},
  async (email,password,done)=>{
    try {
        const user = await finduserbyEmail(email);
        if(!user){
            return done(null,false,{message: 'No user found'});
        }
        const isValid = await bcrypt.compare(password,user.password);
        if(!isValid){
            return done(null,false,{message: 'invalid credentials'});
        }
        return done(null,user);
    } catch (error) {
        return done(error);
    }
  })
);

passport.use(new GoogleStrategy(
      {
        callbackURL: process.env.GOOGLE_CALLBACK,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email;
        const result = await pool.query(
          `select * from users where email = $1 `,
          [email]
        );
        if (result.rowCount === 0) {
          const user = await pool.query(
            `INSERT INTO USERS (user_name , email ) values ($1,$2) returning *`,
            [profile.displayName, email]
          );
          done(null, user.rows[0]);
        } else {
          done(null, result.rows[0]);
        }
      }
    )
  );

passport.serializeUser((user,done)=>{
    console.log("serialize user");
    done(null,user.email);
});

passport.deserializeUser(async(email,done)=>{
    try {
        console.log("deserialize user");
        const user = await finduserbyEmail(email);
        done(null,user);                
    } catch (error) {
        done(error,null);
    }
});

export default passport;

