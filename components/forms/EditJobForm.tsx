"use client"

import Image from "next/image";
import { BenefitsSelector } from "../custom/BenefitsSelector";
import { SalaryRangeSelector } from "../custom/SalaryRangeSelector";
import { JobDescriptionEditor } from "../richTextEditor/JobDescriptionEditor";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "../custom/UploadThingReexported";
import { JobListingDuration } from "../custom/JobListingDuration";
import { useForm } from "react-hook-form";
import { jobSchema } from "@/app/utils/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { countryList } from "@/app/utils/countriesList";
import { useState } from "react";
import { updateJob } from "@/app/actions";

interface EditJobFormProps {
    data: {
        id: string;
    Company: {
        name: string;
        location: string;
        about: string;
        logo: string;
        website: string
        xAccount: string | null;
    };
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    jobDescription: string;
    listingDuration: number;
    benefits: string[];
    }
}

export function EditJobForm({ data }: EditJobFormProps) {
    const [pending, setPending] = useState(false);
    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
          benefits: data.benefits,
          companyAbout: data.Company.about,
          companyLocation: data.Company.location,
          companyName: data.Company.name,
          companyLogo: data.Company.logo,
          companyWebsite: data.Company.website,
          companyXAccount: data.Company.xAccount || "",
          employmentType: data.employmentType,
          jobDescription: data.jobDescription,
          jobTitle: data.jobTitle,
          listingDuration: data.listingDuration,
          location: data.location,
          salaryFrom: data.salaryFrom,
          salaryTo: data.salaryTo,
        },
      });

      async function onSubmit(values: z.infer<typeof jobSchema>) {
          console.log({ values });
          try {
            setPending(true);
            await updateJob(data.id, values);
          } catch (error) {
            if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
              console.log("Something went wrong");
            }
          } finally {
            setPending(false);
          }
        }
    
    return (
        <Form {...form}>
          <form
            className="col-span-1 lg:col-span-2 flex flex-col gap-8 mb-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Job Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Employment Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Employment Type</SelectLabel>
                              <SelectItem value="full-time">Full Time</SelectItem>
                              <SelectItem value="part-time">Part Time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="internship">Internship</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Location</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                          </FormControl>
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
    
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <SalaryRangeSelector
                        control={form.control}
                        minSalary={20000}
                        maxSalary={1000000}
                        step={2000}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <JobDescriptionEditor field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <FormControl>
                        <BenefitsSelector field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Location</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Website" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
    
                  <FormField
                    control={form.control}
                    name="companyXAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company X (Twitter) Account</FormLabel>
                        <FormControl>
                          <Input placeholder="Company X Account" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="companyAbout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Company Description"
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Logo</FormLabel>
                      <FormControl>
                        <div>
                        {field.value ? (
                          <div className="relative w-full">
                            <Image
                              src={field.value}
                              alt="Company Logo"
                              width={100}
                              height={100}
                              className="rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2"
                              onClick={() => field.onChange("")}
                            >
                              <XIcon className="size-2" />
                            </Button>
                          </div>
                        ) : (
                          <UploadDropzone
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              field.onChange(res[0].url);
                            }}
                            onUploadError={() => {
                              console.log("Something went wrong");
                            }}
                            className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border:primary"
                          />
                        )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle>Job Listing Duration</CardTitle>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="listingDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <JobListingDuration field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CardHeader>
            </Card>
    
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Submitting..." : "Update Job Details"}
            </Button>
          </form>
        </Form>
      );
}