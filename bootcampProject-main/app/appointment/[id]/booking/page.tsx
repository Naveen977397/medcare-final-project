'use client'

import React, { useState, useEffect } from 'react'

import Footer from "@/app/components/Footer"
import Button from "@/app/components/Button"
import Calendar from "@/app/components/Calendar"
import {useRouter} from 'next/navigation'
import { useParams } from 'next/navigation'
import styles from "@/app/styles/Booking.module.css"


interface Doctor {
    name: string;
    degree: string;
    speciality: string;
    experience: number;
    rating: number;
    id:number;
    address:string;
}

const Booking: React.FC=()=>{

    const [isOpen, setIsOpen] = useState(false)
    const[date, setDate] = useState('');
    const [time,setTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const[consultType, setConsultType]=useState('');
    const [doctor, setdoctor]=useState<Doctor | null>(null);
    const [addressData, setaddressData]=useState<string>('');
    const {id}=useParams();

    const router = useRouter();

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1; 
        const day = d.getDate();
        return `${year}-${month}-${day}`;
      };


    useEffect(()=>{
        const fetchDoctor = async()=>{
            try{
                const response = await fetch(`http://localhost:5000/api/v1/doctors/${id}`);
                const data = await response.json();
                setdoctor(data.data);
                setaddressData(data.data.location);
            }
            catch(error){
                console.error('Error:', error);
            }
        }
        fetchDoctor();
    },[id]);


    const handleBooking = async()=>{
        if( !date||!time|| !consultType){
            alert("please select all appointment details")
            return;
        }
    const appointmentData = {
        doctor_id: +(id),
        date: formatDate(date),
        time: time,
        consultationType: consultType,
    };

    try{
        const response = await fetch('http://localhost:5000/api/v1/bookAppointment', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },  
            body: JSON.stringify(appointmentData),
        });
        const data = await response.json();
        console.log(data);

        if(response.ok){
            alert("you will get appointment details on mail if approved");
            router.push("/appointment")
        }
        else{
            alert("Failed to book appointment");
        }
    }catch(error){
        console.error('Error:', error);
    }
};

useEffect(() => {
    if (date) {
        const fetchBookedSlots = async () => {
            try {
                const response = await fetch(`http://localhost:5000/appointments`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ date : formatDate(date), doctor_id: id})
                });
                const data = await response.json();
                if (data.success) {
                    setBookedSlots(data.bookedSlots);
                }
            } catch (error) {
                console.error("Error fetching booked slots:", error);
            }
        };
        fetchBookedSlots();
    }
}, [date, id]);
const isSlotDisabled = (slot: string) => bookedSlots.includes(slot);
    const dropDown=()=>{
        setIsOpen(!isOpen)
    }

    const morning = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM","11:30 AM","12:00 AM","12:30 AM"];
    const afternoon = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM","3:30 PM","4:00 PM","4:30PM"];

    const remaining = (arr:string[])=>{
        return arr.filter (slot =>!isSlotDisabled(slot)).length;
    }
    return(
        <>
        <main className={styles.hero}>
            <div className={styles.fstcontainer}>
                <div className={styles.containt}>

                    <div><span className={styles.heading}>Book Your Next<br/>Doctor Visit in<br/>Seconds.</span></div>
                    <div className={styles.para}>
                       <div>CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need.</div> 
                    </div>
                </div>
            </div>


            <div className={styles.scdcontainer}>
                <div className={styles.slotContainer}>
                    <article>
                        <div className={styles.heading_and_button}>
                            <p>Schedule Appointment</p>
                            <Button text={'Book Appointment'} onClick={handleBooking} type={'submit'} variant={'smallcardButtonGreen'}/>
                        </div>
                        <div className={styles.booking}>
                        <button 
                            onClick={() => setConsultType(consultType === 'online' ? '' : 'online')}
                            className={consultType === 'online' ? styles.activeButton : ''}  
                        >
                            Book Video Consult
                        </button>

                        <button 
                            onClick={()=>setConsultType(consultType === 'offline' ? '' : 'offline')}
                            className={consultType === 'offline' ? styles.activeButton : ''}  
                        >
                            Book Hospital Visit
                        </button>
                        </div>
                        <div className={styles.address}>
                            <div className={styles.select} onClick={()=>setIsOpen(!isOpen)}>
                                <p className={isOpen ? styles.showpTag : styles.notshowpTag}>{addressData}</p>
                                <i className="fa-solid fa-caret-down"></i>
                                <ul className={isOpen==true ? styles.show_select_options : styles.hide_select_options}>
                                    <li onClick={()=>setIsOpen(!isOpen)}>{addressData}</li>
                                </ul>
                            </div>
                        </div>

                    </article>
                    <article>
                        <Calendar setDate={setDate}/>
                    </article>
                    <article>
                        <div className={styles.slotOne}>
                            <div>
                                <span>
                                    <i className="fa-solid fa-cloud-sun"></i>
                                    <label>Morning</label>
                                </span>
                                <span>{remaining(morning)} slot</span>
                            </div>
                            <hr/>
                            <div className={styles.slots}>
                                {morning.map(slot => (
                                    <button 
                                        key={slot}
                                        onClick={() => setTime(slot)}
                                        disabled={isSlotDisabled(slot)}
                                        style={{ backgroundColor: isSlotDisabled(slot) ? "gray" : "white" }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.slotTwo}>
                            <div>
                                <span>
                                    <i className="fa-solid fa-cloud-moon"></i>
                                    <label>Afternoon</label>
                                </span>
                                <span>{remaining(afternoon)} slot</span>
                            </div>
                            <hr/>
                            <div className={styles.slots}>
                                {afternoon.map(slot => (
                                    <button 
                                        key={slot}
                                        onClick={() => setTime(slot)}
                                        disabled={isSlotDisabled(slot)}
                                        style={{ backgroundColor: isSlotDisabled(slot) ? "gray" : "white" }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </article>
                    <Button text={'Next'} onClick={handleBooking} variant={'largeGreenBtn'}/>
                </div>
            </div>
        </main>
        <Footer/>
    </>
    )
}

export default Booking;