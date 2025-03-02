"use client"

import { ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { jobListingDurationPricing } from "@/app/utils/jobListingDurationPricing";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { formatCurrency } from "@/app/utils/formatters";
import { cn } from "@/lib/utils";

interface iAppProps {
  field: ControllerRenderProps<any, "listingDuration">;
}

export function JobListingDuration({ field }: iAppProps) {
  return (
    <RadioGroup
      value={field.value?.toString()}
      onValueChange={(value) => field.onChange(parseInt(value))}
    >
      <div className="flex flex-col gap-4">
        {jobListingDurationPricing.map((duration) => (
          <div key={duration.days} className="relative p-2">
            <RadioGroupItem
              id={duration.days.toString()}
              value={duration.days.toString()}
              className="sr-only"
            />
            <Label htmlFor={duration.days.toString()} className="flex flex-col cursor-pointer">
              <Card className={cn(
                field.value === duration.days ? "border-primary bg-primary/10": "hover:bg-secondary/50", "p-4 border-2 transition-all")}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {duration.days} Days
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {duration.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold mb-1">
                      {formatCurrency(duration.price)}
                    </p>
                    <p>${(duration.price / duration.days).toFixed(2)}/day</p>
                  </div>
                </div>
              </Card>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
