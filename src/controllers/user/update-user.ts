import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateUserService } from '../../services/user/update-user'
import { ClientError } from '../../errors/client-error'
import { s3Client } from '@/lib/s3Client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getUserByIdService } from '@/services/user/get-user-by-id'
import { User } from '@prisma/client'
import { addToHistory } from '@/services/history/add'
import { env } from '@/env'

interface Params {
  id: string
}
const { AWS_S3_BUCKET_NAME, AWS_REGION } = env
export async function updateUserController(
  request: FastifyRequest<{
    Params: Params
    Body: Partial<User>
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params
    const { id: userId, role } = request.user as User

    if (id !== userId && role !== 'ADMIN') {
      throw new ClientError('Forbidden')
    }
    if (request.body) {
      const user = await getUserByIdService(userId)
      const data = request.body as User

      if (data.useGooglePicture) {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${user?.GoogleConnection?.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new ClientError(
            `Error fetching Google picture: ${response.status} ${response.statusText}`
          )
        }

        const responseData = await response.json()
        const photoUrl = responseData.picture

        if (photoUrl) {
          data.imageUrl = photoUrl
        }
      }

      const updatedUser = await updateUserService(data)
      return updatedUser
    }

    let updateData: Partial<User> = {}

    const data = await request.file()

    if (data) {
      if (data.file) {
        const fileBuffer = await data.toBuffer()

        const params = {
          Bucket: AWS_S3_BUCKET_NAME,
          Key: userId,
          Body: fileBuffer,
          ContentType: data.mimetype,
        }

        const command = new PutObjectCommand(params)
        await s3Client.send(command)

        const imageUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${userId}`

        const formFields: Record<string, any> = {}
        for (const [key, value] of Object.entries(data.fields)) {
          try {
            const field = Array.isArray(value) ? value[0] : value
            if (field && field.type === 'field' && field.value) {
              formFields[key] = JSON.parse(field.value as string)
            }
          } catch {
            const field = Array.isArray(value) ? value[0] : value
            if (field && field.type === 'field') {
              formFields[key] = field.value
            }
          }
        }

        const typedFormFields = formFields as Partial<User>

        updateData = {
          ...typedFormFields,
          phone: typedFormFields.phone ? String(typedFormFields.phone) : undefined,
          height: typedFormFields.height ? String(typedFormFields.height) : undefined,
          currentWeight: typedFormFields.currentWeight
            ? String(typedFormFields.currentWeight)
            : undefined,
          currentBf: typedFormFields.currentBf
            ? String(typedFormFields.currentBf)
            : undefined,
          imageUrl,
          useGooglePicture: false,
        }
      }
    } else {
      const body = request.body as User

      updateData = {
        ...body,
        height: body.height !== undefined ? String(body.height) : undefined,
        phone: body.phone !== undefined ? String(body.phone) : undefined,
        currentWeight:
          body.currentWeight !== undefined ? String(body.currentWeight) : undefined,
        currentBf: body.currentBf !== undefined ? String(body.currentBf) : undefined,
      }
    }

    updateData.id = id

    const updatedUser = await updateUserService(updateData as User)

    return reply.status(200).send(updatedUser)
  } catch (error) {
    throw error
  }
}
