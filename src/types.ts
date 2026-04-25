export type ModuleStatus = 'locked' | 'in-progress' | 'completed';

export interface CodeExample {
  language: string;
  code: string;
  explanation?: string;
}

export interface TheoryLesson {
  id: string;
  title: { it: string; en: string };
  content: { it: string; en: string };
  keyPoints: { it: string[]; en: string[] };
  codeExamples?: CodeExample[];
  estimatedMinutes: number;
}

export interface PracticalActivity {
  id: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  tasks: { it: string[]; en: string[] };
  successCriteria: { it: string[]; en: string[] };
  hints: { it: string[]; en: string[] };
  estimatedMinutes: number;
  terminalUrl?: string;
}

export interface LearningModule {
  id: number;
  slug: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  category: string;
  theoryLessons: TheoryLesson[];
  practicalActivities: PracticalActivity[];
}

export interface ModuleProgress {
  moduleId: number;
  status: ModuleStatus;
  completedAt: string | null;
  notes: string;
  completedLessons: string[];
  completedActivities: string[];
}

export type Locale = 'it' | 'en';
export type ContentTab = 'theory' | 'practice' | 'terminal';
