import { saveJobPost, unSaveJobPost } from "@/app/actions";

import { auth } from "@/app/utils/auth";
import { getFlagEmoji } from "@/app/utils/countriesList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtml } from "@/components/custom/JsonToHtml";
import { SaveJobButton } from "@/components/custom/SubmitButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// const aj = arcjet
// .withRule(
//     detectBot({
//         mode: "LIVE",
//         allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"]
//     })
// )

// function getClient(session:boolean) {
//     if(session) {
//         return aj.withRule(
//             tokenBucket({
//                 mode: "LIVE",
//                 capacity: 100,
//                 interval: 60,
//                 refillRate: 30
//             })
//         )
//     } else {
//         return aj.withRule(
//             tokenBucket({
//                 mode: "LIVE",
//                 capacity: 100,
//                 interval: 60,
//                 refillRate: 10
//             })
//         )
//     }
// }

async function getJob(jobId: string, userId: string) {
    const [jobPostData, savedJobData] = await Promise.all([
        prisma.jobPost.findUnique({
            where: {
              status: "ACTIVE",
              id: jobId,
            },
            select: {
              jobTitle: true,
              jobDescription: true,
              location: true,
              employmentType: true,
              benefits: true,
              listingDuration: true,
              createdAt: true,
        
              Company: {
                select: {
                  name: true,
                  location: true,
                  about: true,
                  logo: true,
                },
              },
            },
          }),
          userId ? prisma.savedJobPost.findUnique({
            where: {
                userId_jobPostId: {
                    userId: userId,
                    jobPostId: jobId
                }
            }, 
            select: {
                id: true
            }
          }) : null
    ])

    if(jobPostData == null) {
        return notFound()
    }

    return {
        jobPostData,
        savedJobData
    }
}

export default async function JobIdPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const session = await auth()
  // const req = await request()

  // const decision = await getClient(!!session).protect(req, { requested: 10 })

//   if(decision.isDenied()) {
//     throw new Error("forbidden")
//   }

  const { jobPostData, savedJobData } = await getJob(jobId, session?.user?.id as string);

  const locationFlag = getFlagEmoji(jobPostData.location);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="space-y-8 col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{jobPostData.jobTitle}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="font-medium">{jobPostData.Company.name}</p>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full" variant="secondary">
                {jobPostData.employmentType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full items-center flex">
                {jobPostData.location}
              </Badge>
            </div>
          </div>
          {session?.user ? (
            <form action={
                savedJobData ? unSaveJobPost.bind(null, savedJobData.id) : saveJobPost.bind(null, jobId) 
            }>
                <SaveJobButton savedJob={!!savedJobData} />
            </form>
          ): (
            <Link href= "/login" className={buttonVariants({ variant: "outline" })}>
            <Heart className="size-4" />
            Save Job
          </Link>
          )}
          
        </div>
        <section>
          <JsonToHtml json={JSON.parse(jobPostData.jobDescription)} />
        </section>

        <section>
          <h3 className="font-semibold mb-4">Benefits {" "} 
                <span className="ml-2 text-sm text-muted-foreground">(green is offered)</span>

          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = jobPostData.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full",
                    isOffered ? "" : "opacity-75 cursor-not-allowed"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>

        <div className="space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <div>
                    <h3 className="font-semibold">Apply Now</h3>
                    <p className="text-sm text-muted-foreground mt-1" >Please let {jobPostData.Company.name} know you found this job on JobBoard. This help us grow</p>
                </div>
                <Button className="w-full">Apply Now</Button>
                </div>
            </Card>
            <Card className="p-6">
                <h3 className="font-semibold">About the job</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Apply before</span>
                        <span className="text-sm">
                            {new Date(jobPostData.createdAt.getTime() + (jobPostData.listingDuration * 1000 * 60 * 60 * 24)).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Posted On
                        </span>
                        <span className="text-sm d">{jobPostData.createdAt.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Employment Type
                        </span>
                        <span className="text-sm d">{jobPostData.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Location
                        </span>
                        <span className="text-sm d">{locationFlag}</span>
                    </div>
                </div>
            </Card>
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Image src={jobPostData.Company.logo}
                        alt="Company logo"
                        width={96}
                        height={96}
                        className="rounded-full size-24"
                        />
                        <div className="flex flex-col">
                            <h3 className="font-semibold">{jobPostData.Company.name}</h3>
                            <p className="text-sm tetx-muted-foreground line-clamp-3">{jobPostData.Company.about}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );
}
