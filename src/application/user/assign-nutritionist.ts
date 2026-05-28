import { prisma } from '@/infrastructure/database/prisma/client'
import { createHistoryEntry } from '@/application/history/create-history-entry'
import { ClientError } from '@/domain/shared/errors/client-error'

export async function assignNutritionist(
  nutritionistId: string,
  studentId: string
) {
  // Check if nutritionist exists and is a nutritionist
  const nutritionist = await prisma.user.findFirst({
    where: {
      id: nutritionistId,
      role: 'NUTRITIONIST',
    },
  })

  if (!nutritionist) {
    throw new ClientError('Nutritionist not found')
  }

  // Check if student exists
  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
      role: 'STUDENT',
    },
  })

  if (!student) {
    throw new ClientError('Student not found')
  }

  // Create history entry
  await createHistoryEntry(
    studentId,
    `Nutritionist ${nutritionist.name} assigned to student ${student.name}`
  )

  return { nutritionistId, studentId }
}
