import type { FastifyRequest, FastifyReply } from 'fastify'
import type { User } from '@prisma/client'
import { saveProfileImageService } from '@/application/user/save-profile-image'
import { registerProfessionalService } from '@/application/professional/register-professional'
import { saveDocumentsService } from '@/application/user/save-documents'

export async function registerProfessionalController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id: userId } = request.user as User

    const parts = request.parts()

    const formData: Record<string, any> = {}
    const files: Record<string, any> = {}

    for await (const part of parts) {
      if (part.type === 'file') {
        files[part.fieldname] = {
          buffer: await part.toBuffer(),
          filename: part.filename,
          mimetype: part.mimetype,
          toBuffer: async () => part.file,
        }
      } else {
        formData[part.fieldname] = part.value
      }
    }

    const role = formData.role
    const bio = formData.bio
    const experience = Number.parseInt(formData.experience)
    const availability = formData.availability
    const professionalSettings = formData.professionalSettings

    const specialties = JSON.parse(formData.specialties || '[]')
    const certifications = JSON.parse(formData.certifications || '[]')
    const education = JSON.parse(formData.education || '[]')

    let profileImageUrl = null
    let documentUrl = null

    if (files.profileImage) {
      profileImageUrl = await saveProfileImageService(files.profileImage, userId)
    }

    if (files.document) {
      documentUrl = await saveDocumentsService(files.document, userId)
    }

    const professional = await registerProfessionalService({
      userId,
      role,
      bio,
      experience,
      specialties,
      documentUrl,
      certifications,
      education,
      availability,
      imageUrl: profileImageUrl,
      professionalSettings,
    })

    return reply.status(201).send({
      success: true,
      message: 'Professional registered successfully',
      data: professional,
    })
  } catch (error) {
    console.error('Error in registerProfessionalController:', error)
    return reply.status(500).send({
      success: false,
      message: 'Failed to register professional',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
