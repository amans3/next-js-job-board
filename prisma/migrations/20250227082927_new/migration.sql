-- CreateEnum
CREATE TYPE "JobPostStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "JobPost" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salaryFrom" INTEGER NOT NULL,
    "SalaryTo" INTEGER NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "listingDuration" INTEGER NOT NULL,
    "benefits" TEXT[],
    "status" "JobPostStatus" NOT NULL DEFAULT 'DRAFT',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
