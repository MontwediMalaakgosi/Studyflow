export type Subject = 'Math' | 'Science' | 'History' | 'Literature' | 'Computer Science' | 'Physics' | 'Chemistry' | 'Other';

export interface StudyTask {
  id: string;
  title: string;
  subject: Subject;
  deadline: Date;
  weighting: number; // percentage
  progress: number; // 0-100
  urgent: boolean;
}

export interface ClassSession {
  id: string;
  name: string;
  room: string;
  startTime: string; // HH:mm
  endTime: string;
  day: number; // 0-6
  subject: Subject;
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Slide' | 'Textbook' | 'Note';
  subject: Subject;
  url: string;
}
