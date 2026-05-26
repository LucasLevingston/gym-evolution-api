import { z } from 'zod';

export const createMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  timeZone: z.string().optional(),
  professionalId: z.string().uuid('Invalid professional ID format'),
  studentId: z.string().uuid('Invalid student ID format'),
  purchaseId: z.string().uuid('Invalid purchase ID format').optional(),
});

export const updateMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
});

export const meetingParamsSchema = z.object({
  id: z.string().uuid('Invalid meeting ID format'),
});

export const userIdParamsSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const meetingQuerySchema = z.object({
  role: z.enum(['professional', 'student']),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
export type MeetingParams = z.infer<typeof meetingParamsSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type MeetingQuery = z.infer<typeof meetingQuerySchema>;

export const meetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  meetLink: z.string().url().optional(),
  attendees: z.array(z.string().email()).optional(),
  purchaseId: z.string().uuid(),
  professionalId: z.string().uuid(),
  professionalEmail: z.string().email(),
  studentId: z.string().uuid(),
});
