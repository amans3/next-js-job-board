import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export async function JobListingsLoading() {
  return (
    <div className="flex flex-col gap-6">
      {[...Array(10)].map((_, index) => (
        <Card className="p-6" key={index}>
          <div className="flex items-start gap-4">
            <Skeleton className="size-14 rounded" />

            <div className="flex-1 space-y-3 flex-col">
              <Skeleton className="h-5 w-[300px]" />
              <div className="flex flex-row gap-4">
                <Skeleton className="h-3 w-[70px]" />
                <Skeleton className="h-3 w-[70px]" />
                <Skeleton className="h-3 w-[70px]" />
                <Skeleton className="h-3 w-[70px]" />
              </div>
            </div>
            <div className="flex flex-col gap-3 ml-auto">
              <Skeleton className="h-4 w-[70px] items-self-end" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <div className="mt-8">
            <Skeleton className="h-3 w-[400px]" />
          </div>
        </Card>
      ))}
    </div>
  );
}
