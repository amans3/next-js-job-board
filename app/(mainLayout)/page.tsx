import { JobFilters } from "@/components/custom/JobFilters";
import { JobListings } from "../../components/custom/JobListings";
import { Suspense } from "react";
import { JobListingsLoading } from "@/components/custom/JobListingsLoading";


type SearchParams = {
  searchParams: Promise<{
    page?: string
    jobTypes?: string
    location?: string
  }>
}

export default async function Home({ searchParams }: SearchParams) {

  const { page, jobTypes, location } = await searchParams

  const currentPage = Number(page) || 1

  const filterKey =`page=${currentPage};types=${(jobTypes?.split(",") || []).join(",")};location=${location}`

  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingsLoading />} key={filterKey}>
        <JobListings 
        currentPage={currentPage} 
        jobTypes={jobTypes?.split(",") || 
        []}
        location={location as string}
        />
        </Suspense>
      </div>
     
    </div>
  )
}

