import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/infrastructure/external/s3/client'
import { env } from '@/env'

const { AWS_S3_BUCKET_NAME, AWS_REGION } = env

export async function saveProfileImageService(
  file: any,
  userId: string
): Promise<string> {
  try {
    const fileName = `profile-pictures/${userId}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer, // Use file.buffer instead of file
        ContentType: file.mimetype,
      })
    )

    return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`
  } catch (error) {
    console.error('Error saving profile image:', error)
    throw new Error('Failed to save profile image')
  }
}
