import { prisma } from "@/app/utils/db"
import { EmptyState } from "./EmptyState"
import { JobCard } from "./JobCard"
import { MainPagination } from "./MainPagination"
import { JobPostStatus } from "@prisma/client"


export async function getJobs({
    page = 1 ,
    items_per_page = 1,
    jobTypes = [],
    location = ""
}: {
    page: number,
    items_per_page: number,
    jobTypes: string[],
    location: string
}) {
    const skip = (page - 1) * items_per_page
    
    const Where = {
        status: JobPostStatus.ACTIVE,
        ...(jobTypes.length > 0 && {
            employmentType : {
                in: jobTypes,
            }
        }),
        ...(location && location !== "Worldwide" && {
            location: location 
        })
    }
    const [data, totalCount] = await Promise.all([
        prisma.jobPost.findMany({
        where: Where,
        take: items_per_page,
        skip: skip,
        select: {
            id: true,
            jobTitle: true,
            jobDescription: true,
            salaryFrom: true,
            salaryTo: true,
            employmentType: true,
            location: true,
            createdAt: true,
            Company: {
                select: {
                    name:true, 
                    logo: true,
                    location: true,
                    about: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    }),

    prisma.jobPost.count({
        where: {
            status: "ACTIVE"
        }
    })

    ])

    return {
        jobs: data,
        totalPages: Math.ceil(totalCount / items_per_page),
        currentPage: page
    }
}

export async function JobListings({ currentPage, jobTypes = [], location = "" } : {currentPage: number, jobTypes: string[], location: string }) {
    const { jobs, totalPages, currentPage: page } = await getJobs({ 
        page: currentPage, 
        items_per_page: 2,
        jobTypes: jobTypes,
        location: location
    
    })
    return (
        <>
            {jobs.length > 0 ? (
                <div className="flex flex-col gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} data={job} />
                ))}
            </div>
            ) : (
                <EmptyState 
                title="No Jobs Found"
                description="Try searching for a different job title or location" 
                buttonText="Clear all filters"
                href="/"
                />
            )}
            <MainPagination totalPages={totalPages} currentPage={page} />
        </>
    )
}