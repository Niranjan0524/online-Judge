import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-vibe-border bg-vibe-surface p-4 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-text hover:border-vibe-primary/60"
          type="button"
          aria-label="Previous month"
        >
          <FiChevronLeft size={18} />
        </button>
        <div className="font-heading text-lg font-semibold text-vibe-text">
          {month} {year}
        </div>
        <button
          onClick={goToNextMonth}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-text hover:border-vibe-primary/60"
          type="button"
          aria-label="Next month"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-vibe-muted">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm text-vibe-subtext">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              className={`rounded-xl p-2 ${
                isToday
                  ? "bg-vibe-primary text-white"
                  : "hover:bg-vibe-elevated hover:text-vibe-text"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
