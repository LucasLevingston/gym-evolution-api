// import authorizeService from './get';
// import { google } from 'googleapis';

// export async function createCalendarService(
//   userId: string,
//   title: string,
//   description: string,
//   startTime: string,
//   endTime: string,
//   attendeeEmails: string[]
// ) {
//   const auth = await authorizeService(userId);

//   const calendar = google.calendar('v3');

//   const event = {
//     summary: title,
//     description: description,
//     start: {
//       dateTime: startTime,
//       timeZone: 'America/Sao_Paulo',
//     },
//     end: {
//       dateTime: endTime,
//       timeZone: 'America/Sao_Paulo',
//     },
//     attendees: attendeeEmails.map((email) => ({ email })),
//     conferenceData: {
//       createRequest: {
//         requestId: `meeting-${Date.now()}`,
//         conferenceSolutionKey: { type: 'hangoutsMeet' },
//       },
//     },
//     reminders: {
//       useDefault: false,
//       overrides: [
//         { method: 'email', minutes: 24 * 60 },
//         { method: 'popup', minutes: 30 },
//       ],
//     },
//   };

//   const response = await calendar.events.insert({
//     calendarId: 'primary',
//     conferenceDataVersion: 1,
//     requestBody: event,
//   });

//   return response.data;
// }
