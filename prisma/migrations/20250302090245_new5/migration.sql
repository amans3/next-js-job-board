-- DropForeignKey
ALTER TABLE "SavedJobPost" DROP CONSTRAINT "SavedJobPost_jobPostId_fkey";

-- AddForeignKey
ALTER TABLE "SavedJobPost" ADD CONSTRAINT "SavedJobPost_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
