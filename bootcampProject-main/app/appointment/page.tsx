'use client'

import styles from "@/app/styles/Appoint.module.css";
import Footer from '@/app/components/Footer';
import DoctorCard from "@/app/components/DoctorCard";
import { useState, useEffect } from 'react';
import {useRouter} from  'next/navigation';
import {useLogin} from '@/app/context/loginContext'

type Doctor = {
    doc_id:number;
    doc_name: string;
    specialization: string;
    experience: number;
    rating: number;
    gender: string;
}


interface Filters {
    rating: number;
    experience: number;
    gender: string;
}

export default function Appoint () {

    const [filters, setFilters] = useState<Filters>({ rating: 0, experience: 0, gender: "All" });
    const[searchValue,setsearchValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const doctorsPerPage = 6;
    const [doctors,setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const router = useRouter() ;

    const{user} = useLogin(); 

    let loginContext;
    try {
        loginContext = useLogin();
        if (!loginContext || !loginContext.user) {
            return <div>Not Found</div>;
        }
    } catch (error) {
        console.error("Error using login context:", error);
        return <div>Not Found</div>;
    }

    useEffect(()=>{
        const fetchDoc = async()=>{
            try {
                const res = await fetch("http://localhost:5000/api/v1/doctors");
                if(!res.ok){
                    throw new Error('failed to fetch doctors data');
                }
                const data = await res.json();
                console.log("Fetched Data:", data);
                setDoctors(data.data);
                setFilteredDoctors(data.data);
                console.log(doctors);
            } catch (error) {
                console.log(error);
            }
        }
        fetchDoc();
    },[]);

    const applyFilters = () => {
        if(!doctors||doctors.length===0){
            return [];          
        }
        let filtered =[...doctors];
        
        if (filters.rating !== 0) {
            filtered = filtered.filter(doctor => doctor.rating === filters.rating);
        }

        if (filters.experience !== 0) {
            filtered = filtered.filter(doctor => {
                const exp = Number(doctor.experience); 
        
                switch (filters.experience) {
                    case 0: return exp >= 0 && exp <= 1;   
                    case 1: return exp > 1 && exp <= 3;   
                    case 3: return exp > 3 && exp <= 5;    
                    case 5: return exp > 5 && exp <= 10;
                    case 10: return exp >10 && exp <=15;  
                    case 15: return exp > 15;              
                    default: return true;
                }
            });
        }
        
        if (filters.gender !== "All") {
            filtered = filtered.filter(doctor => doctor.gender === filters.gender);
        }

        if (searchQuery) {
            filtered = filtered.filter(doctor => 
                doctor.doc_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    };

    useEffect(() => {

        const filtered = applyFilters();
        
        if (filtered.length > 0) {
            setFilteredDoctors(filtered);
        }else{
            setFilteredDoctors([]);
        }
        setCurrentPage(1); 
    }, [filters, searchQuery]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setsearchValue(event.target.value);
    };

    const resetFilters = () => {
        setFilters({ rating: 0, experience: 0, gender: "All" });
        setSearchQuery("");
    };

    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
    const getDoctorsForCurrentPage = () => {
        const startIndex = (currentPage - 1) * doctorsPerPage;
        const endIndex = startIndex + doctorsPerPage;
        return filteredDoctors.slice(startIndex, endIndex);
    };

    return (
        <div>
            <div className={styles.searchSection}>
                <h2 className={styles.heading}>Find a doctor at your own ease</h2>
                <div className={styles.searchContainer}>
                    <div className={styles.inputWrapper}>
                        <img src="./Search.svg" alt="Search Icon" className={styles.icon} />
                        <input 
                            type="text" 
                            placeholder="Search Doctor" 
                            className={styles.inputField} 
                            onChange={(e)=>handleSearchChange(e)} 
                            onKeyDown={(e)=>{if(e.key==="Enter"){setSearchQuery(searchValue)}}}
                        />
                    </div>
                    <button className={styles.searchButton} onClick={()=>setSearchQuery(searchValue)}>Search</button>
                </div>
            </div>

            <section className={styles.donateSection}>
                <div className={styles.donateTitle}>
                    <h2>{filteredDoctors.length} Doctors Available</h2>
                    <p>Book appointments with minimum wait-time & verified doctor details</p>
                </div>

                <div className={styles.mainFrame}>
                    <div className={styles.sideContent}>
                        <div className={styles.filterbtn}>
                            <p className={styles.filter}>Filter by:</p>
                            <button className={styles.reset} onClick={resetFilters}>
                                Reset
                            </button>
                        </div>

                        <div className={styles.filtersFrame}>
                            <div className={styles["left-filters"]}>
                                <div className={styles.content}>
                                    <p>Rating</p>
                                    <div className={styles.radioWrapper}>
                                        {[0, 1, 2, 3, 4, 5].map((value) => (
                                            <span key={value}>
                                                <input 
                                                    type="radio" 
                                                    id={`rating-${value}`} 
                                                    name="rating" 
                                                    value={value} 
                                                    checked={filters.rating === value} 
                                                    onChange={() => setFilters({ ...filters, rating: value })}
                                                />
                                                <label htmlFor={`rating-${value}`}>{value === 0 ? "Show All" : `${value} Star`}</label>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles["left-filters"]}>
                                <div className={styles.content}>
                                    <p>Experience</p>
                                    <div className={styles.radioWrapper}>
                                        {[[15, "15+ years"], [10, "10-15 years"], [5, "5-10 years"], [3, "3-5 years"], [1, "1-3 years"], [0, "0-1 years"]].map(([value, label]) => (
                                            <span key={value}>
                                                <input 
                                                    type="radio" 
                                                    id={`experience-${value}`} 
                                                    name="experience" 
                                                    value={value} 
                                                    checked={filters.experience === value} 
                                                    onChange={() => setFilters({ ...filters, experience: Number(value) })}
                                                />
                                                <label htmlFor={`experience-${value}`}>{label}</label>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles["left-filters"]}>
                                <div className={styles.content}>
                                    <p>Gender</p>
                                    <div className={styles.radioWrapper}>
                                        {["All", "Male", "Female"].map((value) => (
                                            <span key={value}>
                                                <input 
                                                    type="radio" 
                                                    id={`gender-${value}`} 
                                                    name="gender" 
                                                    value={value} 
                                                    checked={filters.gender === value} 
                                                    onChange={() => setFilters({ ...filters, gender: value })}
                                                />
                                                <label htmlFor={`gender-${value}`}>{value}</label>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        {getDoctorsForCurrentPage().length > 0 ? (
                            getDoctorsForCurrentPage().map((doctor, index) => (
                                <div 
                                    key={doctor.doc_id} 
                                    onClick={() => router.push(`/appointment/${doctor.doc_id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <DoctorCard 
                                        name={doctor.doc_name} 
                                        specialty={doctor.specialization} 
                                        experience={doctor.experience} 
                                        rating={doctor.rating} 
                                        gender={doctor.gender} 
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No doctors found matching the filters.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.paginationSection}>
                <div id={styles.paginationFrame}>
                    <div>
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                            <p>Prev</p>
                        </button>
                    </div>
                    
                    <div id={styles.pageNumbers}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={currentPage === index + 1 ? styles.activePage : ""}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            <p>Next</p>
                        </button>
                    </div>
                    
                </div>
            </section>

            <Footer />
        </div>
    );
}
