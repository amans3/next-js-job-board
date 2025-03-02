-- CreateTable
CREATE TABLE "SavedJobPost" (
    "id" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedJobPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedJobPost_userId_jobPostId_key" ON "SavedJobPost"("userId", "jobPostId");

-- AddForeignKey
ALTER TABLE "SavedJobPost" ADD CONSTRAINT "SavedJobPost_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJobPost" ADD CONSTRAINT "SavedJobPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
