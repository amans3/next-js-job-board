"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchema";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/jobListingDurationPricing";
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export async function createCompany(unsafeData: z.infer<typeof companySchema>) {
  const user = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedCompanyData = companySchema.parse(unsafeData);

  console.log(validatedCompanyData);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validatedCompanyData,
        },
      },
    },
  });

  redirect("/");
}

export async function createJobSeeker(
  unsafeData: z.infer<typeof jobSeekerSchema>
) {
  const user = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedJobSeekerData = jobSeekerSchema.parse(unsafeData);

  console.log(validatedJobSeekerData);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validatedJobSeekerData,
        },
      },
    },
  });

  redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedJobData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
        id: true,
        user: {
          select: {
            stripeCustomerId: true
          }
        }
    }
  });

    if(!company?.id) {

    return redirect("/onboarding")
    }

    let stripeCustomerId = company.user.stripeCustomerId;

    if(!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email as string,
        name: user.name as string 
      })

      stripeCustomerId = customer.id

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          stripeCustomerId: customer.id
        }
      })
    }

    const jobPost = await prisma.jobPost.create({
    data: {
      jobDescription: validatedJobData.jobDescription,
      jobTitle: validatedJobData.jobTitle,
      employmentType: validatedJobData.employmentType,
      location: validatedJobData.location,
      salaryFrom: validatedJobData.salaryFrom,
      salaryTo: validatedJobData.salaryTo,
      listingDuration: validatedJobData.listingDuration,
      benefits: validatedJobData.benefits,
      companyId: company.id,
    },
    select: {
      id: true
    }
  });


  await inngest.send({
    name: "job/created",
    data: {
      jobId: jobPost.id,
      expirationDays: validatedJobData.listingDuration
    }
  })

  const pricingTier = jobListingDurationPricing.find((tier) => tier.days === validatedJobData.listingDuration)

  if(!pricingTier) {
    throw new Error("Invalid Listing duration selected")
  }


  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://x1twbdoqh6.ufs.sh/f/uoLBkq1FAylWp42cLW3yTrCMKlqZ7cYSWxh9253gIfA4wGjt"
            ],
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100
        },
        quantity: 1
      }
    ],
    metadata: {
      jobId: jobPost.id
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`, 
  })


  return redirect(session.url as string)
}

export async function saveJobPost(jobId: string) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  
  await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId,
      userId: user.id as string
    }
  })

  revalidatePath(`/job/${jobId}`)
}

export async function unSaveJobPost(savedJobPostId: string) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  
  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string
    },
    select: {
      jobPost: {
        select: {
          id: true
        }
      }
    }
  })

  revalidatePath(`/job/${data.jobPost.id}`)
}

export async function updateJob(id: string, data: Partial<z.infer<typeof jobSchema>>) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedJobData = jobSchema.parse(data);

 await prisma.jobPost.update({
    where: {
      id,
      Company: {
        userId: user.id
      }
    },
    data: {
      jobDescription: validatedJobData.jobDescription,
      jobTitle: validatedJobData.jobTitle,
      employmentType: validatedJobData.employmentType,
      location: validatedJobData.location,
      salaryFrom: validatedJobData.salaryFrom,
      salaryTo: validatedJobData.salaryTo,
      listingDuration: validatedJobData.listingDuration,
      benefits: validatedJobData.benefits,
    },
    select: {
      id: true
    }
  });

  return redirect("/my-jobs")
}


export async function deleteJob(jobId: string) {
  const session = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)

  if(decision.isDenied()) {
    throw new Error("Forbidden")
  }

  await prisma.jobPost.delete({
    where: {
      id: jobId,
      Company: {
        userId: session.id
      }
    },
  })

  await inngest.send({
    name: "job/cancel.expiration",
    data: { jobId: jobId }
  })
}

