'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorCard from './DoctorCard';
import styles from './DoctorPortal.module.css';

interface Doctor{
    doc_id: number;
    doc_name: string;
    gender: string;
    specialization: string;
    description: string;
    location: string;
    degree:string;
    rating: number;
    experience: number;
}

const DoctorPortal = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const router = useRouter();

    const checkAdminAuth = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/admin/check', {
                credentials: 'include',
            });
            const data = await res.json();
            setIsAdmin(data.isAdmin); 
        } catch (error) {
            setIsAdmin(false); 
        }
    };
    
    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/doctors');
            const data = await res.json();
            setDoctors(data.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const handleDeleteDoctor = async (doc_id: number) => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify({doc_id})
            });

            if (res.ok) {
                setDoctors((prev) => prev.filter((doctor) => doctor.doc_id !== doc_id));
            } else {
                console.error("Failed to delete doctor");
            }
        } catch (error) {
            console.error("Error deleting doctor:", error);
        }
    };


    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/v1/admin/adminlogout', {
                credentials: 'include',
            });

            if (res.ok) {
                setIsAdmin(false); 
                router.push('/login'); 
            } else {
                console.error("Failed to log out");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    useEffect(() => {
        checkAdminAuth();
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchDoctors();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (isAdmin === false) {
            router.push('/login'); 
        }
    }, [isAdmin]);

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    if (isAdmin === false) {
        return <div>Redirecting...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Doctor Portal</h1>
            <div className={styles.buttons}>
                <button className={styles.addButton} onClick={() => router.push('/doctors/addDoctor')}>
                    Add Doctor
                </button>
                <button onClick={()=> router.push('/doctors/appointment')}>
                    Check Appointments
                </button>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className={styles.cardContainer}>
                {doctors.map((doctor,id) => (
                    <DoctorCard key={id} doctor={doctor} onDelete={handleDeleteDoctor} />
                ))}
            </div>
        </div>
    );
};

export default DoctorPortal;
