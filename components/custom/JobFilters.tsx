"use client"

import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/app/utils/countriesList";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const jobTypes = ["full-time", "part-time", "contract", "internship"] as const

export function JobFilters() {

  const router = useRouter()
  const searchParams = useSearchParams()
  // get current filters from the url
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";

  function clearAllFilters() {
    router.push("/")
  }

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if(value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    return params.toString()

  },[searchParams])

  function handleJobTypeChange(jobType: string, checked: boolean) {
    const current = new Set(currentJobTypes)
  
    if(checked) {
      current.add(jobType)
    } else {
      current.delete(jobType)
    }

    const newValues = Array.from(current).join(",")

    router.push(`?${createQueryString("jobTypes", newValues)}`)
  }

  function handleLocationChange(location: string) {
    router.push(`?${createQueryString("location", location)}`)
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
        <Button className="h-8" size="sm" variant="destructive" onClick={clearAllFilters}>
          <span>Clear All</span>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-6">
        <div>
            <Label className="text-lg font-semibold">Job Type</Label>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {jobTypes.map((jobType, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                        id={jobType} 
                        checked={currentJobTypes.includes(jobType)
                        } 
                        onCheckedChange={(checked) => handleJobTypeChange(jobType, checked as boolean)}
                        
                        />
                        <Label htmlFor={jobType} className="text-sm font-medium cursor-pointer">
                            {jobType}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
        <Separator />
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Location</Label>
            <Select value={currentLocation} onValueChange={(location) => handleLocationChange(location)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem value="worldwide">
                            <span>🌍</span>
                            <span className="pl-2">Worldwide / Remote</span>
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-2">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                </SelectContent>
            </Select>
        </div>
      </CardContent>
    </Card>
  );
}
