import { OnBoardingForm } from "@/components/forms/onboarding/OnBoardingForm";
import { redirect } from "next/navigation";
import { prisma } from "../utils/db";
import { requireUser } from "../utils/requireUser";

async function checkFinishedOnBoarding(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId 
        },
        select: {
            onBoardingCompleted: true
        }
    })

    if(user?.onBoardingCompleted === true) {
        return redirect("/")
    }

    return user
}

export default async function OnBoardingPage() {

    const currentUser = await requireUser()
     await checkFinishedOnBoarding(currentUser.id as string)

    return (
       <div className="min-h-screen flex flex-col items-center justify-center py-10">
        <OnBoardingForm />
       </div>
    )
}