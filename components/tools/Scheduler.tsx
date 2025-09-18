import React, { useState, useMemo, useEffect } from 'react';
import { ScheduleEvent } from '../../types';
import { PlusIcon, TrashIcon, CalendarIcon, CogIcon, PrinterIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

type View = 'calendar' | 'list';

const EVENT_TYPE_COLORS: Record<ScheduleEvent['type'], string> = {
  exam: 'bg-red-500',
  assignment: 'bg-yellow-500',
  lecture: 'bg-blue-500',
  deadline: 'bg-purple-500',
  other: 'bg-green-500',
};

const Scheduler: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    // Lazy initializer to get from localStorage
    try {
        const savedEvents = localStorage.getItem('schedulerEvents');
        return savedEvents ? JSON.parse(savedEvents).map((e: any) => ({...e, date: new Date(e.date)})) : [];
    } catch (error) {
        return [];
    }
  });
  const [view, setView] = useState<View>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('schedulerEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    setEvents([...events, { ...event, id: Date.now().toString() }]);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };
    
  const handlePrint = () => window.print();

  const handleExportIcal = () => {
    const toIcalDate = (date: Date) => date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

    let icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AIStudentCompanion//EN',
    ];

    events.forEach(event => {
        icalContent.push('BEGIN:VEVENT');
        icalContent.push(`UID:${event.id}@studentcompanion.app`);
        icalContent.push(`DTSTAMP:${toIcalDate(new Date())}`);
        icalContent.push(`DTSTART:${toIcalDate(event.date)}`);
        // Simple 1-hour duration for events
        const endDate = new Date(event.date);
        endDate.setHours(endDate.getHours() + 1);
        icalContent.push(`DTEND:${toIcalDate(endDate)}`);
        icalContent.push(`SUMMARY:${event.title}`);
        icalContent.push('END:VEVENT');
    });

    icalContent.push('END:VCALENDAR');

    const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
    

  return (
    <div className="bg-surface p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
            <button onClick={() => setView('calendar')} className={`px-3 py-1 text-sm rounded-md ${view === 'calendar' ? 'bg-primary text-white' : 'bg-gray-700'}`}>Calendar</button>
            <button onClick={() => setView('list')} className={`px-3 py-1 text-sm rounded-md ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-700'}`}>List</button>
        </div>
        <div className='flex items-center gap-2'>
            <button onClick={handlePrint} className="p-2 rounded-full hover:bg-gray-700"><PrinterIcon className="w-5 h-5"/></button>
            <button onClick={handleExportIcal} className="p-2 rounded-full hover:bg-gray-700"><DownloadIcon className="w-5 h-5"/></button>
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView currentDate={currentDate} setCurrentDate={setCurrentDate} events={events} />
      ) : (
        <ListView events={events} deleteEvent={deleteEvent} />
      )}

      <button onClick={() => setIsEventModalOpen(true)} className="fixed bottom-24 right-6 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-transform hover:scale-110">
        <PlusIcon className="w-6 h-6" />
      </button>
      
      {isEventModalOpen && <AddEventModal onClose={() => setIsEventModalOpen(false)} addEvent={addEvent} />}
    </div>
  );
};

// Calendar View Component
const CalendarView: React.FC<{ currentDate: Date, setCurrentDate: (d: Date) => void, events: ScheduleEvent[] }> = ({ currentDate, setCurrentDate, events }) => {
    const daysInMonth = useMemo(() => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const days = [];
        while (date.getMonth() === currentDate.getMonth()) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentDate]);

    const startDayOfMonth = currentDate.getDay();

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    }
    
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <button onClick={() => changeMonth(-1)}><ChevronLeftIcon className="w-6 h-6"/></button>
                <h3 className="font-bold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)}><ChevronRightIcon className="w-6 h-6"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-text_secondary">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-1">
                {Array.from({ length: startDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border border-gray-700 rounded-md h-20"></div>)}
                {daysInMonth.map(day => {
                    const dayEvents = events.filter(e => isSameDay(e.date, day));
                    const isToday = isSameDay(new Date(), day);
                    return (
                        <div key={day.toString()} className={`border border-gray-700 rounded-md h-20 p-1 text-left ${isToday ? 'bg-primary/20' : ''}`}>
                            <span className={`text-xs ${isToday ? 'font-bold text-primary-light' : ''}`}>{day.getDate()}</span>
                            <div className="overflow-y-auto max-h-16 text-xs">
                                {dayEvents.map(e => (
                                    <div key={e.id} className={`truncate ${EVENT_TYPE_COLORS[e.type]} rounded px-1 text-white text-opacity-90 mb-0.5`}>{e.title}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// List View Component
const ListView: React.FC<{ events: ScheduleEvent[], deleteEvent: (id: string) => void }> = ({ events, deleteEvent }) => {
    const sortedEvents = [...events].sort((a,b) => a.date.getTime() - b.date.getTime());
    return (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {sortedEvents.length > 0 ? sortedEvents.map(event => (
                <div key={event.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                    <div>
                        <p className="font-bold">{event.title}</p>
                        <p className="text-sm text-text_secondary">{event.date.toLocaleDateString()} - <span className={`px-2 py-0.5 text-xs rounded-full text-white ${EVENT_TYPE_COLORS[event.type]}`}>{event.type}</span></p>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                </div>
            )) : <p className="text-center text-text_secondary">No upcoming events.</p>}
        </div>
    );
};

// Add Event Modal
const AddEventModal: React.FC<{onClose: () => void, addEvent: (e: Omit<ScheduleEvent, 'id'>) => void}> = ({ onClose, addEvent }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<ScheduleEvent['type']>('other');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Date from input is local timezone, new Date() will parse it correctly
        addEvent({ title, date: new Date(date + 'T00:00:00'), type });
        onClose();
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Add New Event</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" required />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md" required />
                    <select value={type} onChange={e => setType(e.target.value as ScheduleEvent['type'])} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md">
                        <option value="exam">Exam</option>
                        <option value="assignment">Assignment</option>
                        <option value="lecture">Lecture</option>
                        <option value="deadline">Deadline</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary rounded-md text-white">Add Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Scheduler;
