'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const AddDoctor = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        doc_name: '',
        gender: '',
        specialization: '',
        description: '',
        location: '',
        rating: '',
        degree: '',
        experience: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/v1/admin/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/doctors'); 
            } else {
                console.error('Failed to add doctor');
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Add Doctor</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input className={styles.inputs} type="text" name="doc_name" placeholder="Doctor Name" value={formData.doc_name} onChange={handleChange} required />
                
                <select className={styles.sel} name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                
                <input className={styles.inputs} type="text" name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} required />
                <textarea className={styles.textArea} name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
                <input className={styles.inputs} type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <input className={styles.inputs} type="number" name="rating" placeholder="Rating (1-5)" value={formData.rating} onChange={handleChange} />
                <input className={styles.inputs} type="text" name="degree" placeholder="Degree" value={formData.degree} onChange={handleChange} required />
                <input className={styles.inputs} type="number" name="experience" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange} required />

                <button type="submit" className={styles.submitButton}>Add Doctor</button>
            </form>
        </div>
    );
};

export default AddDoctor;
