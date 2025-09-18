import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroSession } from '../../types';
import { PlusIcon, CogIcon, ClockIcon, TrashIcon, DownloadIcon } from '../icons/Icons';

const PomodoroTimer: React.FC = () => {
    const [focusMinutes, setFocusMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [timeRemaining, setTimeRemaining] = useState(focusMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
    const [currentTask, setCurrentTask] = useState('');
    const [history, setHistory] = useState<PomodoroSession[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const timerRef = useRef<number | null>(null);
    
    useEffect(() => {
        if (isActive) {
            timerRef.current = window.setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive]);

    useEffect(() => {
        if (timeRemaining < 0) {
            if (isBreak) { // Break finished
                setIsBreak(false);
                setTimeRemaining(focusMinutes * 60);
            } else { // Focus session finished
                setIsBreak(true);
                setTimeRemaining(breakMinutes * 60);
                const session: PomodoroSession = {
                    id: Date.now().toString(),
                    date: new Date(),
                    focusDuration: focusMinutes,
                    breakDuration: breakMinutes,
                    tasks: tasks.map(t => t.text)
                };
                setHistory(prev => [session, ...prev]);
            }
             // Keep running into next session
             setIsActive(true);
        }
    }, [timeRemaining, isBreak, focusMinutes, breakMinutes, tasks]);
    
    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTimeRemaining(focusMinutes * 60);
    };
    
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentTask.trim()) return;
        setTasks([...tasks, { id: Date.now().toString(), text: currentTask, completed: false }]);
        setCurrentTask('');
    };
    
    const toggleTask = (id: string) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const handleExportHistory = () => {
        const dataStr = JSON.stringify(history, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'pomodoro_history.json');
        linkElement.click();
    };

    const totalSeconds = (isBreak ? breakMinutes : focusMinutes) * 60;
    const progress = (totalSeconds - timeRemaining) / totalSeconds * 100;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg text-center">
            <div className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center text-4xl font-mono font-bold transition-colors duration-500 ${isBreak ? 'bg-green-500/20 text-green-300' : 'bg-primary/20 text-primary-light'}`}>
                 <div className="absolute inset-0 rounded-full" style={{background: `conic-gradient(${isBreak ? '#4ade80' : 'rgb(99 102 241)'} ${progress}%, transparent ${progress}%)`}}></div>
                 <div className="relative bg-surface w-40 h-40 rounded-full flex items-center justify-center">
                    {formatTime(timeRemaining)}
                 </div>
            </div>
            <p className="mt-2 text-text_secondary">{isBreak ? 'Break Time' : 'Focus Time'}</p>

            <div className="flex justify-center gap-4 my-6">
                <button onClick={toggleTimer} className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-md font-bold text-white">{isActive ? 'Pause' : 'Start'}</button>
                <button onClick={resetTimer} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-bold">Reset</button>
                <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-gray-600 hover:bg-gray-500 rounded-full"><CogIcon className="w-5 h-5"/></button>
            </div>
            
            <div className="text-left mt-8">
                <h3 className="font-bold text-lg mb-2">Tasks for this Session</h3>
                <form onSubmit={handleAddTask} className="flex gap-2">
                    <input type="text" value={currentTask} onChange={e => setCurrentTask(e.target.value)} placeholder="Add a new task" className="flex-grow p-2 bg-gray-900 border border-gray-600 rounded-md"/>
                    <button type="submit" className="p-2 bg-primary rounded-md"><PlusIcon className="w-6 h-6"/></button>
                </form>
                <ul className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                    {tasks.map(task => (
                        <li key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${task.completed ? 'bg-green-500/10' : 'bg-gray-700'}`}>
                           <input type="checkbox" readOnly checked={task.completed} className="form-checkbox h-5 w-5 rounded bg-gray-800 border-gray-600 text-primary focus:ring-primary"/>
                           <span className={task.completed ? 'line-through text-text_secondary' : ''}>{task.text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {history.length > 0 && (
                <div className="text-left mt-8 pt-4 border-t border-gray-700">
                     <div className='flex justify-between items-center mb-2'>
                        <h3 className="font-bold text-lg">Session History</h3>
                        <button onClick={handleExportHistory} className="p-2 rounded-full hover:bg-gray-700"><DownloadIcon className="w-5 h-5"/></button>
                    </div>
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {history.map(session => (
                            <li key={session.id} className="text-sm p-2 bg-gray-800 rounded-md">
                                <p>{new Date(session.date).toLocaleString()} - {session.focusDuration} min focus</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isSettingsOpen && (
                <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4" onClick={() => setIsSettingsOpen(false)}>
                    <div className="bg-surface rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Timer Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text_secondary mb-1">Focus Duration (minutes)</label>
                                <input type="number" value={focusMinutes} onChange={e => setFocusMinutes(Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text_secondary mb-1">Break Duration (minutes)</label>
                                <input type="number" value={breakMinutes} onChange={e => setBreakMinutes(Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md"/>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                             <button onClick={() => { resetTimer(); setIsSettingsOpen(false); }} className="px-4 py-2 bg-primary rounded-md text-white">Save & Reset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PomodoroTimer;
