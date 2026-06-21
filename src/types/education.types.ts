export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CourseLesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: CourseLevel;
  category: string;
  certification: boolean;
  isLocked: boolean;
  lessons: CourseLesson[];
}

export interface CompleteLessonResponse {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  courseCompleted: boolean;
}

export interface CertificateResponse {
  certificateUrl: string;
  issuedAt: string;
}

export interface ContentStandard {
  title: string;
  description: string;
  passed: boolean;
}

export interface ContentExample {
  id: string;
  title: string;
  creator: string;
  platform: string;
  views: number;
  engagement: number;
  niche: string;
}
