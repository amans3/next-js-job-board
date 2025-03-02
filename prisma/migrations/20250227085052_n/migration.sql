/*
  Warnings:

  - You are about to drop the column `SalaryTo` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `salaryTo` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "SalaryTo",
ADD COLUMN     "salaryTo" INTEGER NOT NULL;
