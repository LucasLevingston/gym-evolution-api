import { prisma } from '@/infrastructure/database/prisma/client'
import type { Diet, History, TrainingWeek, User, Weight } from '@prisma/client'
import { ClientError } from '@/domain/shared/errors/client-error'

interface UpdateUserData extends User {
  histories?: History[]
  oldWeights?: Weight[]
  trainingWeeks?: TrainingWeek[]
  diets?: Diet[]
  ProfessionalSettings?: any
  GoogleConnection?: any
}

export async function updateUserService(updatedUser: UpdateUserData) {
  const existingUser = await prisma.user.findUnique({
    where: { id: updatedUser.id },
    include: {
      history: true,
      oldWeights: true,
      trainingWeeks: true,
      diets: true,
      ProfessionalSettings: true,
      GoogleConnection: true,
    },
  })

  if (!existingUser) {
    throw new ClientError('User not found')
  }

  // Sort weights to find the most recent one
  const sortedWeights = [...(updatedUser.oldWeights || [])].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const mostRecentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : null

  // Update professional settings if provided
  if (updatedUser.ProfessionalSettings) {
    await prisma.professionalSettings.upsert({
      where: {
        userId: updatedUser.id,
      },
      create: {
        userId: updatedUser.id,
        workStartHour: updatedUser.ProfessionalSettings.workStartHour,
        workEndHour: updatedUser.ProfessionalSettings.workEndHour || 17,
        appointmentDuration: updatedUser.ProfessionalSettings.appointmentDuration || 60,
        workDays: updatedUser.ProfessionalSettings.workDays || '1,2,3,4,5',
        bufferBetweenSlots: updatedUser.ProfessionalSettings.bufferBetweenSlots || 0,
        maxAdvanceBooking: updatedUser.ProfessionalSettings.maxAdvanceBooking || 30,
        autoAcceptMeetings: updatedUser.ProfessionalSettings.autoAcceptMeetings || false,
        timeZone: updatedUser.ProfessionalSettings.timeZone || 'America/Sao_Paulo',
      },
      update: {
        workStartHour: updatedUser.ProfessionalSettings.workStartHour,
        workEndHour: updatedUser.ProfessionalSettings.workEndHour,
        appointmentDuration: updatedUser.ProfessionalSettings.appointmentDuration,
        workDays: updatedUser.ProfessionalSettings.workDays,
        bufferBetweenSlots: updatedUser.ProfessionalSettings.bufferBetweenSlots,
        maxAdvanceBooking: updatedUser.ProfessionalSettings.maxAdvanceBooking,
        autoAcceptMeetings: updatedUser.ProfessionalSettings.autoAcceptMeetings,
        timeZone: updatedUser.ProfessionalSettings.timeZone,
      },
    })
  }

  // Update Google connection if provided
  if (updatedUser.GoogleConnection) {
    await prisma.googleConnection.upsert({
      where: {
        userId: updatedUser.id,
      },
      create: {
        userId: updatedUser.id,
        accessToken: updatedUser.GoogleConnection.accessToken,
        refreshToken: updatedUser.GoogleConnection.refreshToken,
        expiresAt: updatedUser.GoogleConnection.expiresAt,
        scope: updatedUser.GoogleConnection.scope,
      },
      update: {
        accessToken: updatedUser.GoogleConnection.accessToken,
        refreshToken: updatedUser.GoogleConnection.refreshToken,
        expiresAt: updatedUser.GoogleConnection.expiresAt,
        scope: updatedUser.GoogleConnection.scope,
      },
    })
  }

  // Update the user
  const result = await prisma.user.update({
    where: { id: updatedUser.id },
    data: {
      name: updatedUser.name ?? existingUser.name,
      sex: updatedUser.sex ?? existingUser.sex,
      street: updatedUser.street ?? existingUser.street,
      number: updatedUser.number ?? existingUser.number,
      zipCode: updatedUser.zipCode ?? existingUser.zipCode,
      city: updatedUser.city ?? existingUser.city,
      state: updatedUser.state ?? existingUser.state,
      birthDate: updatedUser.birthDate ?? existingUser.birthDate,
      phone: updatedUser.phone ?? existingUser.phone,
      currentWeight:
        mostRecentWeight ?? updatedUser.currentWeight ?? existingUser.currentWeight,
      currentBf: updatedUser.currentBf ?? existingUser.currentBf,
      height: updatedUser.height ?? existingUser.height,
      email: updatedUser.email ?? existingUser.email,
      imageUrl: updatedUser.imageUrl ?? existingUser.imageUrl,
      // Only update password if provided
      ...(updatedUser.password ? { password: updatedUser.password } : {}),

      // Professional fields
      bio: updatedUser.bio ?? existingUser.bio,
      experience: updatedUser.experience ?? existingUser.experience,
      specialties: updatedUser.specialties ?? existingUser.specialties,
      certifications: updatedUser.certifications ?? existingUser.certifications,
      education: updatedUser.education ?? existingUser.education,

      ProfessionalSettings: {
        update: {
          data: {
            bufferBetweenSlots: updatedUser.ProfessionalSettings?.bufferBetweenSlots,
            autoAcceptMeetings: updatedUser.ProfessionalSettings?.autoAcceptMeetings,
            appointmentDuration: updatedUser.ProfessionalSettings?.appointmentDuration,
            timeZone: updatedUser.ProfessionalSettings?.timeZone,
            workDays: updatedUser.ProfessionalSettings?.workDays,
            workEndHour: updatedUser.ProfessionalSettings?.workEndHour,
            maxAdvanceBooking: updatedUser.ProfessionalSettings?.maxAdvanceBooking,
            workStartHour: updatedUser.ProfessionalSettings?.workStartHour,
          },
        },
      },

      history: {
        upsert: updatedUser.histories?.map((history) => ({
          where: { id: history.id || 'new-id' },
          create: {
            event: history.event,
            date: history.date,
            ...(history.id ? { id: history.id } : {}),
          },
          update: {
            event: history.event,
            date: history.date,
          },
        })),
      },
      oldWeights: {
        create: updatedUser.oldWeights
          ?.filter((weight) => !weight.id)
          .map((weight) => ({
            weight: weight.weight,
            bf: weight.bf,
            date: weight.date,
          })),
        update: updatedUser.oldWeights
          ?.filter((weight) => weight.id)
          .map((weight) => ({
            where: { id: weight.id },
            data: {
              weight: weight.weight,
              bf: weight.bf,
              date: weight.date,
            },
          })),
      },
      trainingWeeks: {
        // upsert: updatedUser.trainingWeeks?.map((trainingWeek) => ({
        //   where: { id: trainingWeek.id || 'new-id' },
        //   create: {
        //     name: trainingWeek.name,
        //     description: trainingWeek.description,
        //     startDate: trainingWeek.startDate,
        //     endDate: trainingWeek.endDate,
        //     ...(trainingWeek.id ? { id: trainingWeek.id } : {}),
        //   },
        //   update: {
        //     name: trainingWeek.name,
        //     description: trainingWeek.description,
        //     startDate: trainingWeek.startDate,
        //     endDate: trainingWeek.endDate,
        //   },
        // })),
      },
      diets: {
        // upsert: updatedUser.diets?.map((diet) => ({
        //   where: { id: diet.id || 'new-id' },
        //   create: {
        //     name: diet.name,
        //     description: diet.description,
        //     startDate: diet.startDate,
        //     endDate: diet.endDate,
        //     ...(diet.id ? { id: diet.id } : {}),
        //   },
        //   update: {
        //     name: diet.name,
        //     description: diet.description,
        //     startDate: diet.startDate,
        //     endDate: diet.endDate,
        //   },
        // })),
      },
    },
    include: {
      history: true,
      oldWeights: true,
      trainingWeeks: true,
      diets: true,
      ProfessionalSettings: true,
      GoogleConnection: true,
    },
  })

  return result
}
