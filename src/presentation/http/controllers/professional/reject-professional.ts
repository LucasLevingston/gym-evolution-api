import type { FastifyRequest } from "fastify";
import { createNotificationService } from "@/services/notification";
import { rejectProfessionalService } from "@/services/professional";

export async function rejectProfessionalController(
  request: FastifyRequest<{ Params: { id: string }; Body: { reason: string } }>,
) {
  const { id } = request.params;
  const { reason } = request.body;
  try {
    const professionals =
      await rejectProfessionalService(id);

    await createNotificationService({
      message: `Você foi não aprovado como profissional. Motivo: ${reason}`,
      title: "Você foi não aprovado como profissional",
      type: "error",
      userId: id,
      link: "/",
    });

    return professionals;
  } catch (error) {
    throw error;
  }
}
