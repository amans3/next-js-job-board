import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EditJobForm } from "@/components/forms/EditJobForm";
import { notFound } from "next/navigation";

async function getJob(jobId: string, userId: string) {
  const data = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
      Company: {
        userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      jobDescription: true,
      salaryFrom: true,
      salaryTo: true,
      location: true,
      employmentType: true,
      listingDuration: true,
      benefits: true,
      Company: {
        select: {
          about: true,
          name: true,
          location: true,
          xAccount: true,
          logo: true,
          website: true,
        },
      },
    },
  });

  if (data == null) {
    return notFound();
  }

  return data;
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const user = await requireUser();

  const data = await getJob(jobId, user.id as string);

  return <EditJobForm data={data} />;
}
