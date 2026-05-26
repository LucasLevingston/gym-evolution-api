import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getTrainersService() {
  const trainers = await prisma.user.findMany({
    where: { role: "TRAINER" },
  })

  return trainers.map((user) => ({
    id: user.id,
    name: user.name || "Unknown",
    email: user.email,
    role: user.role,
    city: user.city || "Remote",
    state: user.state || "",
    imageUrl: user.imageUrl || "",
    experience: user.experience || 0,
    rating: user.rating || 4.5,
    specialties: user.specialties ? JSON.parse(user.specialties) : [],
  }))
}

