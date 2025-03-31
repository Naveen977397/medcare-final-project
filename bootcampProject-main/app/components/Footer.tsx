import styles from '../styles/Footer.module.css'
export default function Footer(){
    return(
        <div className={styles.footerSection}>
            <div className={styles.footerText}>
                <p>© EmScripts 2024. All Right Reserved.</p>
            </div>
            <div className={styles.footerIcons}>
                <div>
                    <img src='/Phone.svg'></img> 
                </div>
                <div>
                    <img src='/Whatsapp.svg'></img>
                </div>
            </div>   
        </div>
    )
}
