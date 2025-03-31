'use client'

import styles from '../styles/login.module.css';
import Button from '../components/Button';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {useLogin} from '@/app/context/loginContext'

const Login = () => {

    console.log('inside login comp');

    const[pass,setPass] = useState(true);
    const[email,setemail] = useState('');
    const[password,setpassword] = useState('');

    const {fetchUser, user} = useLogin();
    const router = useRouter();

    const loginhandler = async(e)=>{
        e.preventDefault();
        console.log(email,password);

        const response = await fetch('http://localhost:5000/api/v1/user/login', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        if(response.ok){
            await fetchUser();
        }
        else{
            alert("invalid credentials");
        }
    }

    useEffect(() => {
        console.log('inside login');
        
        if (user) {
            router.push("/home");
        }
    }, [user]);

    if (user) {
        return (
            <p>Already logged in , redirecting to login page</p>
        );
    }

    return (
        <div className={styles.login}>
            <div className={styles['login-form']}>
                <h2 className={styles.title}>Login</h2>
                <div className={styles['signup-text']}>
                   <p>Are you a new member? <a className = {styles['signup-link']}href=".\signup">Sign up here.</a></p>
                </div>
                <form onSubmit={loginhandler}>

                    <div className={styles.email}>
                        <label htmlFor='email'>Email</label>
                        <div className={styles.inputGroup}>
                            <span className={styles.icon}><img src='/At.svg'></img></span>
                            <input 
                                  type="email" 
                                  placeholder="emmawatson@gmail.com"
                                  value={email}
                                  onChange={(e)=>setemail(e.target.value)}
                                  name="email"
                                  required
                                  />
                        </div>
                    </div>

                    <div className={styles.password}>
                        <label htmlFor='password'>Password</label>
                        <div className={styles.inputGroup}>
                            <span className={styles.icon}><img src='/Lock.svg'></img></span>
                            <input 
                                 type={pass ? "password" : "text"} 
                                 placeholder="Enter your Password" 
                                 value={password}
                                 name='password'
                                 required
                                 onChange={(e)=>setpassword(e.target.value)}
                                 />
                                 
                            <img 
                                src='.\Eye.svg' 
                                className={pass ? styles.toggleHidden: styles.toggleVisible}
                                onClick={()=>{setPass(!pass)}}></img>
                        </div>
                    </div>

                    <Button text="login" variant='primary' type='submit' />

                    <Button text='Reset' variant='secondary' type = "button" onClick={()=> {
                        console.log("Reset Button Clicked");
                        setemail(""); 
                        setpassword("");
                        }}/>

                    <Button text='google sign in' variant='primary' type = "button" onClick={()=> {
                        router.push("http://localhost:5000/api/v1/google/");
                        setemail(""); 
                        setpassword("");
                        }}/>
                    
                </form>
            </div>
        </div>
    );
};

export default Login;
