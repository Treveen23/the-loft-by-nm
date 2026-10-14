import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  id?: string;
  selectedDate: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  required?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePicker({ id, selectedDate, onChange, required = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize calendar view to either the selected date or today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Format the date for friendly viewing: e.g., "Saturday, Jun 27, 2026" or "Select Preferred Date"
  const getFriendlyDateString = (dateStr: string) => {
    if (!dateStr) return 'Select Preferred Date';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Select Preferred Date';
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Select Preferred Date';
    }
  };

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Generate days array: blank cells for alignment, then day numbers
  const dayCells: { day: number | null; dateStr: string; isDisabled: boolean; isSelected: boolean; isToday: boolean }[] = [];

  // Blank slots for previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push({ day: null, dateStr: '', isDisabled: true, isSelected: false, isToday: false });
  }

  // Populate actual days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    
    // STRICTLY FUTURE-ONLY VALIDATION: Must be tomorrow or later
    // Alternatively: today + 1 day, i.e., checkDate.getTime() > today.getTime()
    const isPastOrToday = checkDate.getTime() <= today.getTime();
    
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const cellDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    const isSelected = selectedDate === cellDateStr;
    const isTodayCell = 
      day === today.getDate() && 
      currentMonth === today.getMonth() && 
      currentYear === today.getFullYear();

    dayCells.push({
      day,
      dateStr: cellDateStr,
      isDisabled: isPastOrToday,
      isSelected,
      isToday: isTodayCell
    });
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (dateStr: string, isDisabled: boolean) => {
    if (isDisabled) return;
    onChange(dateStr);
    setIsOpen(false);
  };

  return (
    <div id={`datepicker-container-${id || 'default'}`} ref={containerRef} className="relative w-full">
      {/* Date Trigger Button: Wide 44px+ mobile touch targets */}
      <button
        id={`datepicker-trigger-${id || 'default'}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-ivory text-charcoal border border-charcoal/10 py-3.5 px-4 rounded-xs text-sm font-sans flex items-center justify-between text-left focus:outline-hidden focus:border-gold focus:ring-1 focus:ring-gold cursor-pointer min-h-[48px]"
      >
        <span className={selectedDate ? 'text-charcoal font-medium' : 'text-charcoal/40 font-normal'}>
          {getFriendlyDateString(selectedDate)}
        </span>
        <CalendarIcon size={16} className="text-gold shrink-0" />
      </button>

      {/* Popover Calendar Grid */}
      {isOpen && (
        <div 
          id={`datepicker-popover-${id || 'default'}`}
          className="absolute z-50 mt-2 left-0 w-[280px] sm:w-80 bg-white border border-charcoal/10 shadow-lg p-4 rounded-xs animate-fadeIn text-charcoal font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-ivory rounded-full text-charcoal/80 hover:text-gold transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-serif text-sm font-semibold tracking-wide text-charcoal">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-ivory rounded-full text-charcoal/80 hover:text-gold transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of Week labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-xs font-bold uppercase tracking-wider text-charcoal/40">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {dayCells.map((cell, idx) => {
              const { day, dateStr, isDisabled, isSelected, isToday } = cell;

              if (day === null) {
                return <div key={`empty-${idx}`} className="py-2" />;
              }

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(dateStr, isDisabled)}
                  className={`
                    py-2 text-xs rounded-full font-mono font-medium transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center mx-auto
                    ${isDisabled 
                      ? 'text-charcoal/20 cursor-not-allowed bg-transparent' 
                      : isSelected 
                        ? 'bg-gold text-white shadow-xs' 
                        : isToday 
                          ? 'border border-gold text-gold hover:bg-gold/10' 
                          : 'text-charcoal hover:bg-gold/10 hover:text-gold'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Calendar Helper Footer */}
          <div className="mt-4 pt-3 border-t border-charcoal/5 flex items-center justify-between text-xs text-charcoal/75">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              <span>Selected Date</span>
            </span>
            <span>* Appointments require future date</span>
          </div>
        </div>
      )}
    </div>
  );
}
