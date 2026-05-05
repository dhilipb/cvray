import React from "react";
import DashboardClient from "./DashboardClient";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Fetch actual stats from the database
  const totalProfiles = await prisma.userProfile.count();
  
  // Count job applications that have a tweaked CV
  const tailoredCvs = await prisma.jobApplication.count({
    where: {
      tweakedCvJson: {
        not: null,
      },
    },
  });

  const applicationsTracked = await prisma.jobApplication.count();

  const stats = {
    totalProfiles,
    tailoredCvs,
    applicationsTracked,
  };

  return <DashboardClient stats={stats} />;
}
