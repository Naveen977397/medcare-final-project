
import styles from '@/app/styles/Emergeny.module.css'
import Image from 'next/image';

export default function emergency (){
    return(
        <div className={styles.container}>
            <div className={styles.contacts}>
                <h1>Emergency Contacts/help : </h1>
                <p>For ambulance and hospital emergencies :  </p>
                <p>Dial 108 for general medical emergencies</p>
                <p>Dial 102 for maternal and child health emergencies.</p>
                <p>You can also dial 112 for a general emergency response system.</p>
            </div>
            <div className={styles.image}>
                <Image src="/emer.jpg" alt="emergency" width={100} height={100}>

                </Image>
            </div>
        </div>
        
    )
}