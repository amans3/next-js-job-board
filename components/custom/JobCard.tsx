import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { formatCurrency } from "@/app/utils/formatters";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardHeader } from "../ui/card";

interface JobCardProps {
  data: {
    id: string;
    createdAt: Date;
    Company: {
      name: string;
      location: string;
      about: string;
      logo: string;
    };
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    jobDescription: string;
  };
}

export function JobCard({ data }: JobCardProps) {
  return (
    <Link href={`/job/${data.id}`}>
      <Card className="hover:shadow-slate-400 hover:-translate-y-2 transition duration-300 hover:border-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Image
              src={data.Company.logo}
              alt={data.Company.name}
              width={96}
              height={96}
              className="size-24 rounded-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2">{data.jobTitle}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {data.Company.name}
                </p>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <Badge className="rounded-full" variant="secondary">
                  {data.employmentType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <Badge className="roundd-full">{data.location}</Badge>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(data.salaryFrom)} - {" "}
                  {formatCurrency(data.salaryTo)}
                </p>
              </div>
            </div>
            <div className="md:ml-auto">
                <div className="flex items-center gap-2 justify-end">
                    <MapPin className="size-4" />
                    <h1>{data.location}</h1>
                </div>
                <p className="text-sm text-muted-foreground md:text-right">{formatRelativeTime(data.createdAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-base text-muted-foreground line-clamp-2">{data.Company.about}</p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
