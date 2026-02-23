import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // اقرأ الكوكيز من الهيدر مباشرة (أضمن من cookies() في بعض حالات Vercel)
    const cookieHeader = request.headers.get("cookie") || "";

    const getCookie = (name: string) => {
      const match = cookieHeader
        .split(";")
        .map(s => s.trim())
        .find(c => c.startsWith(name + "="));
      return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
    };

    const userId = getCookie("user_session");
    const role = getCookie("user_role");

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        isLoggedIn: false,
        isAdmin: false,
        user: null,
      });
    }

    // نحاول نجيب المستخدم من أي جدول موجود (User / Candidate / Employer / Admin)
    const p: any = prisma;

    const user =
      (await p.user?.findUnique?.({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
      })) ||
      (await p.candidate?.findUnique?.({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      })) ||
      (await p.employer?.findUnique?.({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      })) ||
      (await p.admin?.findUnique?.({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      }));

    if (!user) {
      // كوكي موجود بس مش لاقيينه في DB (كوكي قديم/غلط)
      return NextResponse.json({
        authenticated: false,
        isLoggedIn: false,
        isAdmin: false,
        user: null,
      });
    }

    const finalRole = (user.role || role || "").toString();
    const isAdmin = finalRole === "ADMIN";

    return NextResponse.json({
      authenticated: true,
      isLoggedIn: true,
      isAdmin,
      user: { ...user, role: finalRole },
    });
  } catch (e) {
    console.error("check-session error:", e);
    // رجّع 200 عشان الهيدر مايفضلش يبوظ الصفحة
    return NextResponse.json({
      authenticated: false,
      isLoggedIn: false,
      isAdmin: false,
      user: null,
    });
  }
}