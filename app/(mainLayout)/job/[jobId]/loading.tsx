import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-8 col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex flex-row justify-between mb-2">
                <Skeleton className="h-6 w-[500px] rounded-2xl" />
                <Skeleton className="ml-[200px] h-6 w-[70px] rounded-lg" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-[70px]" />
                <Skeleton className="h-3 w-[70px]" />
                <Skeleton className="h-3 w-[70px]" />
              </div>
            </div>
          </div>

          {/*  Job Description  */}
          <section className="space-y-4">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[270px]" />
          </section>
          {/* Benefit Section */}
          <section>
            <Skeleton className="h-4 w-[200px] mb-4" />
            <div className="flex flex-wrap gap-3">
              {[...Array(25)].map((_, index) => (
                <Skeleton key={index} className="h-5 w-[140px] rounded-full" />
              ))}
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-4 w-[300px] mb-2" />
                <Skeleton className="h-3 w-full mb-4" />

                <Skeleton className="h-8 w-full mb-2" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-4 w-[300px] mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-3 w-full mb-4" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-4 flex items-center gap-4">
              <div>
                <Skeleton className="h-6 w-[100px] rounded-2xl" />
              </div>
              <div>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-3 w-[200px] mb-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
