'use client';

import { useState, useEffect } from 'react';
import styles from './appointment.module.css';

type Appointment = {
    appointment_id: number;
    user_name: string;
    user_email: string;
    doc_name: string;
    appointment_date: string;
    appointment_time: string;
    consultation_type: string;
    status: string; 
};

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const[count, setCount] = useState(0);

        const fetchAppointments = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/v1/admin/appointments');
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data.data); 
                } else {
                    console.error('Failed to fetch appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        useEffect(()=>{
            fetchAppointments();
        },[count])
    
    const updateStatus = async (appointment_id: number, status: 'approve' | 'decline') => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/${status}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointment_id })
            });

            if (res.ok) {
                setAppointments(prevAppointments =>
                
                    prevAppointments.map(appointment =>
                        appointment.appointment_id === appointment_id ? { ...appointment, status } : appointment
                    )
                );
                setCount(count+1);
            } else {
                console.error(`Failed to ${status} appointment`);
            }
        } catch (error) {
            console.error(`Error ${status}ing appointment:`, error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Appointments</h1>
            <div className={styles.appointmentList}>
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div key={appointment.appointment_id} className={styles.card}>
                            <p><strong>Patient:</strong> {appointment.user_name} ({appointment.user_email})</p>
                            <p><strong>Doctor:</strong> {appointment.doc_name}</p>
                            <p><strong>Date:</strong> {appointment.appointment_date}</p>
                            <p><strong>Time:</strong> {appointment.appointment_time}</p>
                            <p><strong>Type:</strong> {appointment.consultation_type}</p>
                            <p><strong>Status:</strong> <span className={styles.status}>{appointment.status}</span></p>
                            
                            {appointment.status === 'pending' && (
                                <div className={styles.buttonGroup}>
                                    <button className={styles.approve} onClick={() => updateStatus(appointment.appointment_id, 'approve')}>Approve</button>
                                    <button className={styles.decline} onClick={() => updateStatus(appointment.appointment_id, 'decline')}>Decline</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={styles.noAppointments}>No appointments found.</p>
                )}
            </div>
        </div>
    );
};

export default Appointments;
