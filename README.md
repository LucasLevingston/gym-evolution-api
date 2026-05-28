# Gym Evolution — API

REST API for the Gym Evolution fitness platform. Manages training plans, diet tracking, body progress, professional-student relationships, and subscriptions.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js 22 + tsx (no compile step) |
| Framework | Fastify + fastify-type-provider-zod |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (@fastify/jwt) |
| Validation | Zod |
| Docs | Swagger UI at `/docs` |
| Payments | MercadoPago + AbacatePay |
| Email | Nodemailer |
| Tests | Vitest |
| Container | Docker + docker-compose |
| IaC | Terraform (AWS ECS Fargate) |

## Getting started

### Local (with Docker Compose)

```bash
# Start API + PostgreSQL + Redis
docker-compose up

# API available at http://localhost:3333
# Swagger docs at http://localhost:3333/docs
```

### Local (bare metal)

```bash
npm install

# Copy env file and fill in values
cp .env.example .env

# Run migrations and seed
npx prisma migrate dev
npm run seed

# Start with hot-reload
npm run dev
```

## Environment variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gymevolution
JWT_SECRET_KEY=your-secret
PORT=3333
HOST=0.0.0.0
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (tsx --watch) |
| `npm start` | Start without watch |
| `npm test` | Run test suite (Vitest) |
| `npm run test:coverage` | Run tests with coverage |
| `npm run seed` | Seed database |

## API endpoints

Full documentation at `http://localhost:3333/docs` (Swagger UI).

**Main resources:**
- `POST /auth/login` — authenticate
- `POST /users/register` — register user
- `GET /health` — health check (used by ALB)
- `/training-weeks` — training plan management
- `/training-days` — training day management
- `/exercises` — exercise tracking
- `/series` — set/rep tracking
- `/diets` — diet plan management
- `/meals` — meal tracking
- `/meal-items` — meal item tracking
- `/professionals` — professional management
- `/plans` — subscription plans
- `/purchases` — payment processing
- `/meetings` — scheduling
- `/progress` — body progress tracking
- `/notifications` — notification system

## Infrastructure

Terraform IaC in `infra/`. See [infra/README.md](infra/README.md) for deployment instructions.

```
infra/
├── backend/      # S3 state + DynamoDB lock (bootstrap once)
├── shared/       # ECR + GitHub OIDC (shared between envs)
├── modules/      # networking, ecs, rds, redis, alb, iam, cloudwatch
└── environments/
    ├── dev/      # development environment
    └── prod/     # production environment
```

## Project structure

```
src/
├── application/     # use cases and business logic
├── infrastructure/  # external integrations (payments, email, storage)
├── presentation/    # HTTP routes and controllers
├── shared/          # utilities, error handling
├── server.ts        # Fastify server setup
└── app.ts           # entry point
```

## Related

- [gym-evolution-web](https://github.com/LucasLevingston/gym-evolution-web) — Next.js frontend
