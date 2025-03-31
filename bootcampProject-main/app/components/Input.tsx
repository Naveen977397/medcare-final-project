"use client"
import React, { useState } from "react"; 
import styles from "../styles/Input.module.css";

interface InputProps {
  label?: string;
  placeholder?: string;
  text?: string;
  type?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, placeholder, text, type, name,value,required,onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>

        {text && (
          <span className={styles.icon}>
            <img src={text} alt="icon" />
          </span>
        )}

        <input 
            type={inputType} 
            placeholder={placeholder} 
            className={styles.inputField} 
            name={name} 
            value={value} 
            required={required}
            onChange={onChange}/>

        {type === "password" && (
          <img 
            src="./Eye.svg" 
            className={showPassword ? styles.toggleHidden : styles.toggleVisible} 
            onClick={() => setShowPassword(!showPassword)}
            alt="Toggle password visibility"
          />
        )}
      </div>
    </div>
  );
};

export default Input;
