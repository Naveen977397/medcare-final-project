"use client"
import styles from "../styles/Button.module.css";

interface ButtonProps {
    text?: string;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | 'largeGreenBtn' |'smallcardButtonGreen';
    onClick?: () => void;
  }

  const Button: React.FC<ButtonProps> = ({ text = "Button", variant = "primary", type = "button", onClick}) => {
    return (
      <button className={`${styles.button} ${styles[variant]}`} onClick={onClick} type={type}>
        {text}
      </button>
    );
  };

export default Button;
