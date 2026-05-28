-- CreateEnum
CREATE TYPE "SexEnum" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "DayOfWeekEnum" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "MealTypeEnum" AS ENUM ('BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER', 'NIGHT_SNACK');

-- CreateEnum
CREATE TYPE "MeetingStatusEnum" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- AlterTable: User.sex String? -> SexEnum?
ALTER TABLE "users" ADD COLUMN "sex_new" "SexEnum";
UPDATE "users" SET "sex_new" = CASE
  WHEN UPPER("sex") = 'MALE' THEN 'MALE'::"SexEnum"
  WHEN UPPER("sex") = 'FEMALE' THEN 'FEMALE'::"SexEnum"
  WHEN UPPER("sex") = 'OTHER' THEN 'OTHER'::"SexEnum"
  ELSE NULL
END;
ALTER TABLE "users" DROP COLUMN "sex";
ALTER TABLE "users" RENAME COLUMN "sex_new" TO "sex";

-- AlterTable: TrainingDay.dayOfWeek String -> DayOfWeekEnum
ALTER TABLE "trainingDays" ADD COLUMN "dayOfWeek_new" "DayOfWeekEnum";
UPDATE "trainingDays" SET "dayOfWeek_new" = UPPER("dayOfWeek")::"DayOfWeekEnum"
  WHERE UPPER("dayOfWeek") IN ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY');
ALTER TABLE "trainingDays" DROP COLUMN "dayOfWeek";
ALTER TABLE "trainingDays" RENAME COLUMN "dayOfWeek_new" TO "dayOfWeek";
ALTER TABLE "trainingDays" ALTER COLUMN "dayOfWeek" SET NOT NULL;

-- AlterTable: Meal.mealType String? -> MealTypeEnum?
ALTER TABLE "meals" ADD COLUMN "mealType_new" "MealTypeEnum";
UPDATE "meals" SET "mealType_new" = UPPER("mealType")::"MealTypeEnum"
  WHERE UPPER("mealType") IN ('BREAKFAST','MORNING_SNACK','LUNCH','AFTERNOON_SNACK','DINNER','NIGHT_SNACK');
ALTER TABLE "meals" DROP COLUMN "mealType";
ALTER TABLE "meals" RENAME COLUMN "mealType_new" TO "mealType";

-- AlterTable: Meeting.status String -> MeetingStatusEnum
ALTER TABLE "meetings" ADD COLUMN "status_new" "MeetingStatusEnum";
UPDATE "meetings" SET "status_new" = UPPER("status")::"MeetingStatusEnum"
  WHERE UPPER("status") IN ('SCHEDULED','COMPLETED','CANCELLED','RESCHEDULED');
-- default remaining to SCHEDULED
UPDATE "meetings" SET "status_new" = 'SCHEDULED'::"MeetingStatusEnum" WHERE "status_new" IS NULL;
ALTER TABLE "meetings" DROP COLUMN "status";
ALTER TABLE "meetings" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "meetings" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "meetings" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED'::"MeetingStatusEnum";
