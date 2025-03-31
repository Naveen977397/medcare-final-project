import styles from './DoctorCard.module.css';

interface Doctor {
    doc_id: number;
    doc_name: string;
    gender: string;
    specialization: string;
    description: string;
    location: string;
    rating?: number;
    degree: string;
    experience: number;
}

const DoctorCard = ({ doctor, onDelete }: { doctor: Doctor, onDelete: (id: number) => void }) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.name}>{doctor.doc_name}</h2>
            <p className={styles.gender}>Gender: {doctor.gender}</p>
            <p className={styles.specialization}>{doctor.specialization}</p>
            <p className={styles.degree}>Degree: {doctor.degree}</p>
            <p className={styles.experience}>Experience: {doctor.experience} years</p>
            <p className={styles.location}>Location: {doctor.location}</p>
            <p className={styles.description}>{doctor.description}</p>
            {doctor.rating && (
                <p className={styles.rating}>Rating: ⭐ {doctor.rating}/5</p>
            )}
            <button className={styles.deleteButton} onClick={() => onDelete(doctor.doc_id)}>Delete</button>
        </div>
    );
};

export default DoctorCard;
