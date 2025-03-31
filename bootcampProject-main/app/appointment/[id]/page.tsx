'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from '@/app/styles/profilePage.module.css';
import { useRouter } from "next/navigation";

const ProfilePage = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router= useRouter();
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/doctors/${id}`);
                if (!response.ok) throw new Error("Failed to fetch doctor details");
                const result = await response.json();
                setDoctor(result.data); 
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading) return <h1 className={styles.loading}>Loading...</h1>;
    if (error) return <h1 className={styles.error}>{error}</h1>;
    if (!doctor) return <h1 className={styles.notFound}>Doctor not found</h1>;

    return (
        <div className={styles.card}>
            <div className={styles.Title}>
                <div className={styles.imageFrame}>
                    <Image src="/Frame.svg" alt="Doctor Frame" width={100} height={100} />
                </div>
                <div className={styles.titleFrame}>
                    <h6>{doctor.doc_name}</h6>
                    <div className={styles['role-exp']}>
                        <div className={styles.role}>
                            <Image src="/Stethoscope.svg" alt="Stethoscope" width={20} height={20} />
                            <p>{doctor.specialization}</p>
                        </div>
                        <div className={styles.experience}>
                            <Image src="/Hourglass.svg" alt="Hourglass" width={20} height={20} />
                            <p>{doctor.experience} years</p>
                        </div>
                    </div>
                </div>
                <div className={styles.ratingContainer}>
                    <div className={styles.ratingText}>
                        <p>Rating:</p>
                    </div>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, index) => (
                            <Image
                                key={index}
                                src="/Star.svg"
                                alt="Star"
                                width={20}
                                height={20}
                                className={index < doctor.rating ? styles.filledstar : styles.emptystar}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <p className={styles.description}>{doctor.description}</p>
            <p className={styles.location}><strong>Location:</strong> {doctor.location}</p>
            <p className={styles.degree}><strong>Degree:</strong> {doctor.degree}</p>
            <button className={styles.button} onClick={() => router.push(`/appointment/${id}/booking`)}>Book Appointment</button>
        </div>
    );
};

export default ProfilePage;
