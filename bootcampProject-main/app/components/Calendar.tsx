import { useState, useRef, useEffect } from "react";
import styles from "@/app/styles/Calendar.module.css";

const Calendar = ({setDate}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateMonthDates = (month: Date) => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
      const newDate = new Date(day);
      if (month.getMonth() === today.getMonth() && newDate < today) {
        continue; 
      }
      dates.push(newDate);
    }
    return dates;
  };

  useEffect(() => {
    console.log('selectedDate: in useeffect :', selectedDate);
    setDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setVisibleDates(generateMonthDates(currentMonth));
  }, [currentMonth]);

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (previousMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(previousMonth);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 70 * 7; 
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.calendar_container}>
      <div className={styles.month_navigation}>
        <button className={styles.nav_btn} onClick={prevMonth}>{"<"}</button>
        <span className={styles.month_label}>
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button className={styles.nav_btn} onClick={nextMonth}>{">"}</button>
      </div>

      <div className={styles.scroll_wrapper}>
        <button className={styles.scroll_btn} onClick={() => scroll("left")}>{"<"}</button>
        <div className={styles.dates_list} ref={scrollRef}>
          {visibleDates.map((date, index) => (
            <button
              key={index}
              className={`${styles.date_button} ${
                selectedDate.toDateString() === date.toDateString() ? styles.selected : ""
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {date.toLocaleDateString("en-US", { weekday: "short" })} <br />
              {date.getDate()} {date.toLocaleDateString("en-US", { month: "short" })}
            </button>
          ))}
        </div>
        <button className={styles.scroll_btn} onClick={() => scroll("right")}>{">"}</button>
      </div>
    </div>
  );
};

export default Calendar;