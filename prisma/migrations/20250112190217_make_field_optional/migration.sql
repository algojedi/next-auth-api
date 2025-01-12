-- AlterTable
ALTER TABLE "app_user" ADD COLUMN     "picture" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
