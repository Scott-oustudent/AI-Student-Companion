
export type ScheduleEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'assignment' | 'lecture' | 'deadline' | 'other';
};

export type PomodoroSession = {
  id: string;
  date: Date;
  focusDuration: number;
  breakDuration: number;
  tasks: string[];
};

export type Flashcard = {
  question: string;
  answer: string;
};

export type Citation = {
  id: string;
  sourceDetails: string;
  formattedCitation: string;
  style: string;
};

export const ReferencingStyles = [
  'APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 
  'Vancouver', 'AMA', 'ACS', 'OSCOLA', 'Bluebook'
] as const;

export type ReferencingStyle = typeof ReferencingStyles[number];
