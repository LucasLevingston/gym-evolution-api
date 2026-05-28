import { S3, ListBucketsCommand } from '@aws-sdk/client-s3'
import { env } from '@/env'

export const s3Client = new S3({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export { ListBucketsCommand }
