'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './page.module.css'
export default function AdminLogin() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/v1/admin/adminlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: key }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      router.push("/doctors");
    } else {
      setError("Invalid key");
    }
  };

  return (
    <div className={styles.login}>
        <h2 className={styles.title}>Admin Login</h2>
        <input
            type="password"
            placeholder="Enter Admin Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={styles.inputField}
        />
        <button onClick={handleLogin} className={styles.button}>Login</button>
        {error && <p className={styles.error}>{error}</p>}
    </div>
);
}
