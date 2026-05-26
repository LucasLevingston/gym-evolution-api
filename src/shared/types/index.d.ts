import 'fastify'
import { User } from '@prisma/client'

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null
  }
}

export interface MultipartFile {
  type: 'file'
}
export interface MultipartValue<T = unknown> {
  type: 'value'
}

if (part.type === 'file') {
  part.toBuffer()
}
