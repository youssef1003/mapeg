import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Prisma Lazy (ما يتعملش وقت import)
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");

  const g = globalThis as unknown as { __prisma?: any };
  if (!g.__prisma) {
    g.__prisma = new PrismaClient();
  }
  return g.__prisma;
}

export async function GET() {
  try {
    const prisma = await getPrisma();

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

    // مهم: ما نرجّعش 500 عشان ما يوقعش build
    return NextResponse.json({
      content: null,
      values: [],
      milestones: [],
      team: [],
      offices: [],
    });
  }
}