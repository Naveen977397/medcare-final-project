'use client'
import Image from 'next/image';
import styles from '../styles/home.module.css'
import Link from 'next/link'
import {useLogin} from '@/app/context/loginContext'
const LandingPage = () =>{

    const{user} = useLogin();
    return(
        <section className={styles.hero}>

            <div className={styles.left}>
                <div className={styles['left-text']}>
                    <h1>Health in Your Hands.</h1>
                    <p>
                        Take control of your healthcare with CareMate. Book appointments with ease,
                        explore health blogs, and stay on top of your well-being, all in one place.
                    </p>
                </div>
                <div className={styles['button-container']}>
                    <Link href={user ? "/appointment" : "/login"} className={styles.link}>
                        <button className={styles.btn}>Get started</button>
                    </Link>
                    
                </div>
            </div>

            <div className={styles.rightdiv}>
                <Image src={'/home.png'} alt='hello' fill className={styles.img} />
            </div>
        </section>
    )
}

export default LandingPage;