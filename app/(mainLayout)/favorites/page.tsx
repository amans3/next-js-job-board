import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/custom/EmptyState";
import { JobCard } from "@/components/custom/JobCard";

async function getFavorites(userId: string) {
    const data = await prisma.savedJobPost.findMany({
        where: {
            userId
        },
        select: {
            jobPost: {
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
                            name: true,
                            location: true,
                            logo: true,
                            about: true
                        }
                    }

                }
            }
        }
    })

    return data 
}

export default async function FavoritesPage() {
    const user = await requireUser()
    const data = await getFavorites(user.id as string)

    if(data.length === 0) {
        return (
            <EmptyState 
            title="No Favorites found" 
            description="You don't have any favorites yet"
            buttonText="Find a job"
            href="/"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 mt-5 gap-4">
            {data.map((favorite) => (
                <JobCard key={favorite.jobPost.id} data={favorite.jobPost} />
            ))}
        </div>
    )
}