import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [content, values, milestones, team, offices] = await Promise.all([
      prisma.aboutPageContent.findUnique({ where: { id: "main" } }),
      prisma.aboutValue.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutMilestone.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutTeamMember.findMany({ orderBy: { order: "asc" } }),
      prisma.aboutOffice.findMany({ orderBy: { order: "asc" } }),
    ]);

    return NextResponse.json({
      content,
      values,
      milestones,
      team,
      offices,
    });
  } catch (error) {
    console.error("Error fetching about page:", error);

    // مهم: ما نرجعش 500 عشان ما يوقعش build/runtime لو DB فيها مشكلة/لسه فاضية
    return NextResponse.json({
      content: null,
      values: [],
      milestones: [],
      team: [],
      offices: [],
    });
  }
}