import styles from './DoctorList.module.css';

const DoctorList = ({ doctors, refreshDoctors }: { doctors: any[], refreshDoctors: () => void }) => {
    const handleDelete = async (doc_id: number) => {
        try {
            await fetch(`http://localhost:5000/api/doctors/${doc_id}`, { method: 'DELETE' });
            refreshDoctors();
        } catch (error) {
            console.error("Error deleting doctor:", error);
        }
    };

    return (
        <div className={styles.listContainer}>
            <ul className={styles.doctorList}>
                {doctors.map((doctor) => (
                    <li key={doctor.doc_id} className={styles.doctorItem}>
                        <span>{doctor.doc_name} - {doctor.specialization}</span>
                        <button className={styles.deleteButton} onClick={() => handleDelete(doctor.doc_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorList;
