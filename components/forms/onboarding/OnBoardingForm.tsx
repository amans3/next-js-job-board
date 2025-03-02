"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { UserTypeSelection } from "./UserTypeForm";
import { CompanyForm } from "./CompanyForm";
import { JobSeekerForm } from "./JobSeekerForm";

type UserSelectionType = "company" | "jobseeker" | null;

export function OnBoardingForm() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserSelectionType>(null);

  function handleUserTypeSelection(type: UserSelectionType) {
    setStep(2);
    setUserType(type);
  }

  function renderStep() {
    switch (step) {
      case 1: {
        return <UserTypeSelection onSelect={handleUserTypeSelection} />;
      }
      case 2: {
        return userType === "company" ? (
            <CompanyForm />
        ) : (
          <JobSeekerForm />
        );
      }

      default: {
        return null;
      }
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-10">
        <Image src={logo} alt="Job Board Logo" width={50} height={50} />
        <h1 className="text-4xl font-bold">
          Job<span className="text-primary">Board</span>
        </h1>
      </div>
      <Card className="max-w-lg w-full">
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </>
  );
}
