import { PutObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '@/infrastructure/database/prisma/client'
import { s3Client } from '@/infrastructure/external/s3/client'
import { env } from '@/env'

const { AWS_S3_BUCKET_NAME, AWS_REGION } = env

export async function saveDocumentsService(file: any, userId: string): Promise<string> {
  try {
    const fileName = `documents/${userId}/`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    )

    return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`
  } catch (error) {
    console.error('Error saving documents:', error)
    throw new Error('Failed to save documents')
  }
}
