// Payment are not synchronous

import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch {
    return new Response("Webhook error", {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer;

    const jobId = session.metadata?.jobId;

    if (!jobId)
      return new Response("No Job Id found", {
        status: 400,
      });

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId as string,
      },
      select: {
        Company: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return new Response("No Company found for the user", {
        status: 400,
      });
    }

    await prisma.jobPost.update({
      where: {
        id: jobId,
        companyId: user.Company?.id as string,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  return new Response(null, {
    status: 200,
  });
}
