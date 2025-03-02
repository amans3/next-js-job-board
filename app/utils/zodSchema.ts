import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(1, "Required"),
  about: z
    .string()
    .min(10, "Please provide some information about your company"),
  logo: z.string().min(1, "Please upload a logo"),
  website: z.string().url("Please enter a valid URL"),
  xAccount: z.string().optional(),
});

export const jobSeekerSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  about: z.string().min(10, "Please provide more information about yourself"),
  resume: z.string().min(1, "Please upload your resume"),
});

export const jobSchema = z.object({
  jobTitle: z.string().min(2, "Required"),
  employmentType: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  salaryFrom: z.number().min(1, "Required"),
  salaryTo: z.number().min(1, "Required"),
  jobDescription: z.string().min(1, "Required"),
  listingDuration: z.number().min(1, "Required"),
  benefits: z.array(z.string()).min(1, "Please select atleast one benefit"),
  companyName: z.string().min(1, "Required"),
  companyLocation: z.string().min(1, "Required"),
  companyAbout: z.string().min(10, "Required(minimum 10 characters)"),
  companyLogo: z.string().min(1, "Required"),
  companyWebsite: z.string().min(1, "Required"),
  companyXAccount: z.string().optional()
});
