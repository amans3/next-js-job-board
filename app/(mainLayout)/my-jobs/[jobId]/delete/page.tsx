import { deleteJob } from "@/app/actions";
import { requireUser } from "@/app/utils/requireUser";
import { GeneralSumitButton } from "@/components/custom/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DeleteJobPage({ params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = await params;
    await requireUser()
    return (
        <div>
            <Card className="max-w-lg mx-auto mt-24">
                <CardHeader>
                    <CardTitle>Are you sure?</CardTitle>
                    <CardDescription>
                        This action cannot be undone. This will permanently delete this job.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-end">
                    <div className="flex gap-2">
                    <Link href="/my-jobs" className={buttonVariants({ variant: "outline" })}>
                        <ArrowLeft />
                        Cancel
                    </Link>
                
                    <form action={async () => {
                        "use server"
                        await deleteJob(jobId)
                        redirect("/my-jobs")
                    }}>
                        <GeneralSumitButton text="Delete Job" variant="destructive" />
                    </form>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}