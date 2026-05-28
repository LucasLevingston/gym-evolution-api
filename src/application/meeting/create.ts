import { prisma } from '@/infrastructure/database/prisma/client';
import { google } from 'googleapis';
import { ClientError } from '@/domain/shared/errors/client-error';
import { oauth2Client } from '@/infrastructure/external/google/oauth2-client';

interface CreateMeetingParams {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  purchaseId: string;
  professionalId: string;
  professionalEmail: string;
  studentId: string;
  attendees?: string[];
  userId: string;
}

export async function createMeetingService({
  title,
  description,
  startTime,
  endTime,
  purchaseId,
  professionalId,
  professionalEmail,
  studentId,
  attendees = [],
  userId,
}: CreateMeetingParams) {
  // Verify that the user is the student
  if (userId !== studentId) {
    throw new ClientError('Forbidden');
  }

  // Get the purchase to verify it exists and is in the correct status
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      buyer: true,
      professional: true,
    },
  });

  if (!purchase) {
    throw new ClientError('Purchase not found');
  }

  if (purchase.status !== 'ACTIVE') {
    throw new ClientError('Invalid purchase status');
  }

  // Verify the professional exists
  const professional = await prisma.user.findUnique({
    where: { id: professionalId },
  });

  if (!professional) {
    throw new ClientError('Professional not found');
  }

  // Get the user's Google Calendar connection
  const userGoogleConnection = await prisma.googleConnection.findUnique({
    where: { userId: studentId },
  });

  if (!userGoogleConnection) {
    throw new ClientError('Google Calendar not connected');
  }

  // Initialize Google Calendar API
  oauth2Client.setCredentials({
    access_token: userGoogleConnection.accessToken,
    refresh_token: userGoogleConnection.refreshToken || undefined,
    expiry_date: userGoogleConnection.expiresAt?.getTime(),
  });

  const calendar = google.calendar({ version: 'v3' });

  // Get student email
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { email: true },
  });

  if (!student) {
    throw new ClientError('Student not found');
  }

  // Prepare attendees list
  const meetingAttendees = [
    { email: student.email }, // Student
    { email: professionalEmail }, // Professional
    ...attendees.map((email) => ({ email })), // Additional attendees
  ];

  // Create Google Meet event
  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: title,
      description: description || '',
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: meetingAttendees,
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
    conferenceDataVersion: 1,
  });

  if (!event.data.id || !event.data.hangoutLink) {
    throw new Error('Failed to create Google Meet event');
  }

  // Save meeting to database
  const meeting = await prisma.meeting.create({
    data: {
      title,
      description: description || '',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      meetLink: event.data.hangoutLink,
      meetingCode: event.data.id,
      status: 'SCHEDULED',
      professional: {
        connect: { id: professionalId },
      },
      student: {
        connect: { id: studentId },
      },
      purchase: {
        connect: { id: purchaseId },
      },
    },
  });

  // Update purchase status
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: 'ACTIVE' },
  });

  // Create notification for professional
  await prisma.notification.create({
    data: {
      title: 'Nova reunião agendada',
      message: `${student.email} agendou uma reunião com você para ${new Date(
        startTime
      ).toLocaleString()}`,
      type: 'MEETING_SCHEDULED',
      link: `/meetings/${meeting.id}`,
      user: {
        connect: { id: professionalId },
      },
    },
  });

  return {
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    startTime: meeting.startTime.toISOString(),
    endTime: meeting.endTime.toISOString(),
    meetLink: meeting.meetLink,
    purchaseId: meeting.purchaseId,
    professionalId: meeting.professionalId,
    professionalEmail,
    studentId: meeting.studentId,
    attendees: meetingAttendees.map((attendee) => attendee.email),
  };
}
