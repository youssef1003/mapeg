import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch about page content
    const content = await prisma.aboutPageContent.findUnique({
      where: { id: 'main' }
    })

    // Fetch values
    const values = await prisma.aboutValue.findMany({
      orderBy: { order: 'asc' }
    })

    // Fetch milestones
    const milestones = await prisma.aboutMilestone.findMany({
      orderBy: { order: 'asc' }
    })

    // Fetch team members
    const team = await prisma.aboutTeamMember.findMany({
      orderBy: { order: 'asc' }
    })

    // Fetch offices
    const offices = await prisma.aboutOffice.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      content,
      values,
      milestones,
      team,
      offices
    })
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json(
      { error: 'Failed to fetch about page content' },
      { status: 500 }
    )
  }
}