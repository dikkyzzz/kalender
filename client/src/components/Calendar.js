import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

function Calendar({ onDateClick, progressData, onMonthChange }) {
  const dateProgressCount = React.useMemo(() => {
    return progressData.reduce((acc, progress) => {
      acc[progress.tanggal] = (acc[progress.tanggal] || 0) + 1;
      return acc;
    }, {});
  }, [progressData]);

  const dayCellContent = (arg) => {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, '0');
    const day = String(arg.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const count = dateProgressCount[dateStr];
    
    return (
      <div className="day-cell-wrapper">
        <div className="day-number">{arg.dayNumberText}</div>
        {count > 0 && (
          <div className="day-indicator">
            <span className="indicator-text">Nice Step :)</span>
            {count > 1 && <span className="indicator-count">{count}</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={onDateClick}
        dayCellContent={dayCellContent}
        datesSet={onMonthChange}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        height="auto"
      />
    </div>
  );
}

export default Calendar;
