'use client'

import Input from "../components/Input";
import styles from "../styles/signup.module.css";
import Button from "../components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
    const [userInfo, setUserInfo] = useState({
        user_name: "",
        email: "",
        password: "",
    });


    const router = useRouter();

    const validate = (email)=>{
        const reg = /^[a-zA-Z0-9._%+-]+@(gmail\.com|tothenew\.com)$/;
        return reg.test(email);

    }
    const signupHandler = async (e) => {
        e.preventDefault();
        if(!validate(userInfo.email)){
            alert("wrong email format entered");
            return
        }
        try {
            const response = await fetch('http://localhost:5000/api/v1/user/signup', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });

            const data = await response.json();
            console.log("Signup Response:", data); 

            if (response.ok) {
                alert("Signup successful!");
                router.push('/login'); 
            } else {
                alert(data.message || "Signup failed. Please try again."); 
            }
        } catch (error) {
            console.error("Signup Error:", error); 
            alert("An error occurred. Please try again.");
        }
    };

    const resetHandler = () => {
        setUserInfo({
            user_name: "",
            email: "",
            password: "",
        });
    };

    return (
        <div className={styles.signup}>
            <div className={styles['signup-form']}>
                <h6 className={styles.title}>Signup</h6>
                <div className={styles['signup-text']}>
                   <p>Are you already a member? <a className={styles['signup-link']} href="/login">Login</a></p>
                </div>
                <form className={styles.form} onSubmit={signupHandler}>
                    <Input 
                        label='Name' 
                        placeholder="Enter your name" 
                        type="text" 
                        text="./Name.svg"
                        name="user_name"
                        value={userInfo.user_name}
                        required
                        onChange={(e) => setUserInfo({ ...userInfo, user_name: e.target.value })}
                    />

                    <Input  
                        label="Email" 
                        placeholder="Enter your email address" 
                        type="email" 
                        text="./At.svg"
                        name="email"
                        value={userInfo.email}
                        required
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, email: e.target.value });
                            if(!validate(e.target.value)){
                                console.log("invalid email domain ")
                            }
                            }
                        }
                    />

                    <Input 
                        label="Password" 
                        placeholder="Enter your Password" 
                        type="password" 
                        text="./Lock.svg"
                        name="password"
                        value={userInfo.password}
                        required
                        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    />

                    <Button text="Signup" variant='primary' type="submit" />

                    <Button text='Reset' variant='secondary' onClick={resetHandler} type="button"/>
                </form>
            </div>
        </div>
    );
};

export default Signup;
