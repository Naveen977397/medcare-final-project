"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "../styles/Navbar.module.css";
import { useLogin } from "@/app/context/loginContext";

const Navbar = () => {
  const { user, logout, fetchUser } = useLogin(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();


  const handleLogout =(async () => {
    try {
      await logout();
      setMenuOpen(false);
      router.push("/login");
    } catch (error) {
      console.log("Logout failed:");
    }
  });

  useEffect(() => {
    fetchUser();
  }, [pathname]); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <div className={styles["navbar-logo"]}>
          <div className={styles["image-frame"]}>
            <img className={styles.image} src="/Trust.png" alt="MedCare Logo" />
          </div>
          <p className={styles.logoText}>MedCare</p>
        </div>

        <div className={styles["navbar-links"]}>
          <Link className={styles.link} href="/home">
            Home
          </Link>
          <Link className={styles.link} href="/appointment">
            Appointments
          </Link>
          <Link className={styles.link} href="/blogs">
            Health Blog
          </Link>
          <Link className={styles.link} href="#">
            Reviews
          </Link>
        </div>
      </div>

      <div className={styles.authButtons}>
        {user ? (
          <button className={styles.login} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              <button className={styles.login}>Login</button>
            </Link>
            <Link href="/signup">
              <button className={styles.register}>Register</button>
            </Link>
          </>
        )}
      </div>

      <button className={styles.hamburger} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.active : ""}`}>
        <Link className={styles.mobileLink} href="/home">
          Home
        </Link>
        <Link className={styles.mobileLink} href="/appointment">
          Appointments
        </Link>
        <Link className={styles.mobileLink} href="#">
          Health Blog
        </Link>
        <Link className={styles.mobileLink} href="#">
          Reviews
        </Link>
        <div className={styles.mobileAuth}>
          {user ? (
            <button className={styles.login} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className={styles.login}>Login</button>
              </Link>
              <Link href="/signup">
                <button className={styles.register}>Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

