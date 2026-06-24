import { apiClient } from '../lib/api-client';
import { Course, CompleteLessonResponse, CertificateResponse, ContentStandard, ContentExample } from '../types/education.types';

export const educationService = {
  // Seeded via prisma db seed (3 courses). isLocked is always false — no prerequisite chain modeled yet.
  async listCourses(): Promise<{ items: Course[] }> {
    return apiClient.post('/education/courses/list', {});
  },

  async completeLesson(courseId: string, lessonId: string): Promise<CompleteLessonResponse> {
    return apiClient.post('/education/courses/lessons/complete', { courseId, lessonId });
  },

  // 400 COURSE_NOT_COMPLETED if the course doesn't offer certification or not all lessons are complete.
  async getCertificate(courseId: string): Promise<CertificateResponse> {
    return apiClient.post('/education/courses/certificate/get', { courseId });
  },

  async listStandards(): Promise<{ items: ContentStandard[] }> {
    return apiClient.post('/education/standards/list', {});
  },

  async listExamples(niche?: string): Promise<{ items: ContentExample[] }> {
    return apiClient.post('/education/examples/list', niche ? { niche } : {});
  },
};
