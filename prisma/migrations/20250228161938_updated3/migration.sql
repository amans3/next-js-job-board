/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `JobPost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobPost_companyId_key" ON "JobPost"("companyId");
