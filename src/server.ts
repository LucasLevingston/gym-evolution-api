import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "path";
import { authRoutes } from "@/presentation/http/routes/auth-routes";
import { dietRoutes } from "@/presentation/http/routes/diet-routes";
import { exerciseRoutes } from "@/presentation/http/routes/exercise-routes";
import { fatsecretRoutes } from "@/presentation/http/routes/fatsecret-routes";
import { googleRoutes } from "@/presentation/http/routes/google-routes";
import { historyRoutes } from "@/presentation/http/routes/history-routes";
import { mealItemsRoutes } from "@/presentation/http/routes/meal-items-routes";
import { mealRoutes } from "@/presentation/http/routes/meal-routes";
import { meetingRoutes } from "@/presentation/http/routes/meeting-routes";
import { notificationRoutes } from "@/presentation/http/routes/notification-routes";
import { planRoutes } from "@/presentation/http/routes/plan-routes";
import { professionalRoutes } from "@/presentation/http/routes/professional-routes";
import { purchaseRoutes } from "@/presentation/http/routes/purchase-routes";
import { serieRoutes } from "@/presentation/http/routes/serie-routes";
import { subscriptionPlanRoutes } from "@/presentation/http/routes/subscription-plan-routes";
import { trainingDayRoutes } from "@/presentation/http/routes/training-day-routes";
import { trainingWeekRoutes } from "@/presentation/http/routes/training-week-routes";
import { userRoutes } from "@/presentation/http/routes/user-routes";
import { weightRoutes } from "@/presentation/http/routes/weight-routes";
import { env } from "./env";
import { errorHandler } from "@/shared/utils/error-handler";

const { JWT_SECRET_KEY } = env;

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.register(fastifyCors, {
  origin: "*",
});

server.register(fastifyJwt, {
  secret: JWT_SECRET_KEY || "secret-key",
});

server.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Gym Evolution API",
      description: "API for Gym Evolution",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

server.setErrorHandler(errorHandler);
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.register(fastifyCookie);
server.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

server.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

server.register(userRoutes, { prefix: "/users" });
server.register(authRoutes, { prefix: "/auth" });
server.register(historyRoutes, { prefix: "/history" });
server.register(trainingWeekRoutes, { prefix: "/training-weeks" });
server.register(weightRoutes, { prefix: "/weights" });
server.register(trainingDayRoutes, { prefix: "/training-days" });
server.register(exerciseRoutes, { prefix: "/exercises" });
server.register(serieRoutes, { prefix: "/series" });
server.register(dietRoutes, { prefix: "/diets" });
server.register(mealRoutes, { prefix: "/meals" });
server.register(mealItemsRoutes, { prefix: "/meal-items" });
server.register(professionalRoutes, { prefix: "/professionals" });
server.register(planRoutes, { prefix: "/plans" });
server.register(notificationRoutes, { prefix: "/notifications" });
server.register(purchaseRoutes, { prefix: "/purchases" });
server.register(meetingRoutes, { prefix: "/meetings" });
server.register(googleRoutes, { prefix: "/google" });
server.register(fatsecretRoutes, { prefix: "/fatsecret" });
server.register(subscriptionPlanRoutes, { prefix: "/subscription-plans" });

server.get("/health", { schema: { hide: true } }, () => {
  return { status: "ok", uptime: process.uptime() };
});

server.get("/help", () => {
  return {
    message: "Welcome to GymEvolution!",
  };
});

export { server };
