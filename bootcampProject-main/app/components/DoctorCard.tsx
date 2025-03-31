import styles from '../styles/DoctorCard.module.css';
import Image from 'next/image';
interface Doctor {
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    gender: string;
}
const DoctorCard = ({name,specialty,experience,rating,gender}:Doctor)=>{
    return(
        <div className={styles.card}>
            <div className={styles.Title}>
                <div className={styles.imageFrame}>
                   <img src='.\Frame.svg'></img>
                </div>
                <div className={styles.titleFrame}>
                    <h6>{name}</h6>
                    <div className={styles['role-exp']}>
                        <div className={styles.role}>
                            <img src='.\Stethoscope.svg'></img>
                            <p>{specialty}</p>
                        </div>
                        <div className={styles.experience}>
                            <img src='.\Hourglass.svg'></img>
                            <p>{experience}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.ratingContainer}>
                    <div className={styles.ratingText}>
                        <p>Rating :</p>
                    </div>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, index) => (
                            <Image
                                key={index}
                                src="./Star.svg"
                                alt="Star"
                                width={20}
                                height={20}
                                className={index<rating ? styles.filledstar : styles.emptystar}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <button className={styles.button}>Book Appointment</button>
        </div>
        
    )
}
export default DoctorCard;