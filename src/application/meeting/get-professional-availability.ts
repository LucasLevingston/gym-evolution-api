import { prisma } from '@/infrastructure/database/prisma/client';
import { google } from 'googleapis';
import { oauth2Client } from '@/infrastructure/external/google/oauth2-client';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { ClientError } from '@/domain/shared/errors/client-error';
import { getUserByIdService } from '@/application/user/get-user-by-id';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export async function getProfessionalAvailabilityService(
  professionalId: string,
  dateString: string
): Promise<TimeSlot[]> {
  const parsedDate = parseISO(dateString);
  const dayStart = startOfDay(parsedDate);
  const dayEnd = endOfDay(parsedDate);

  const googleConnection = await prisma.googleConnection.findFirst({
    where: {
      userId: professionalId,
    },
  });

  if (!googleConnection) {
    throw new ClientError('Professional has not connected their Google Calendar');
  }

  oauth2Client.setCredentials({
    access_token: googleConnection.accessToken,
    refresh_token: googleConnection.refreshToken || undefined,
    expiry_date: googleConnection.expiresAt?.getTime() || undefined,
    token_type: googleConnection.tokenType,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const busyTimesResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = busyTimesResponse.data.calendars?.primary?.busy || [];

  const professional = await getUserByIdService(professionalId);

  if (!professional) throw new ClientError('Professional not found');
  const workStartHour = professional.ProfessionalSettings?.workStartHour || 9;
  const workEndHour = professional.ProfessionalSettings?.workEndHour || 17;
  const slotDurationMinutes =
    professional.ProfessionalSettings?.appointmentDuration || 60;

  const allTimeSlots: TimeSlot[] = [];

  const now = new Date();

  for (let hour = workStartHour; hour < workEndHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const slotStart = new Date(dayStart);
      slotStart.setHours(hour, minute, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + slotDurationMinutes);

      if (
        slotEnd.getHours() > workEndHour ||
        (slotEnd.getHours() === workEndHour && slotEnd.getMinutes() > 0)
      ) {
        continue;
      }

      if (slotStart < now) {
        continue;
      }

      const isOverlapping = busySlots.some((busySlot) => {
        const busyStart = new Date(busySlot.start!);
        const busyEnd = new Date(busySlot.end!);

        return (
          (slotStart >= busyStart && slotStart < busyEnd) ||
          (slotEnd > busyStart && slotEnd <= busyEnd) ||
          (slotStart <= busyStart && slotEnd >= busyEnd)
        );
      });

      allTimeSlots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        available: !isOverlapping,
      });
    }
  }

  const existingMeetings = await prisma.meeting.findMany({
    where: {
      professionalId,
      startTime: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: {
        not: 'CANCELLED',
      },
    },
  });

  const availableTimeSlots = allTimeSlots.map((slot) => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    const overlapsWithMeeting = existingMeetings.some((meeting) => {
      const meetingStart = new Date(meeting.startTime);
      const meetingEnd = new Date(meeting.endTime);

      return (
        (slotStart >= meetingStart && slotStart < meetingEnd) ||
        (slotEnd > meetingStart && slotEnd <= meetingEnd) ||
        (slotStart <= meetingStart && slotEnd >= meetingEnd)
      );
    });

    return {
      ...slot,
      available: slot.available && !overlapsWithMeeting,
    };
  });

  return availableTimeSlots;
}
