import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, persona } = await request.json();

    let user;

    // Fast persona login shortcut for demo convenience
    if (persona) {
      if (persona === "STUDENT") {
        user = await prisma.user.findFirst({ where: { role: "STUDENT", email: "student.maya@oakridge.edu" } });
      } else if (persona === "TEACHER") {
        user = await prisma.user.findFirst({ where: { role: "TEACHER", email: "teacher.davis@oakridge.edu" } });
      } else if (persona === "ADMIN") {
        user = await prisma.user.findFirst({ where: { role: "ADMIN", email: "admin@oakridge.edu" } });
      }
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (user && user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        classId: user.classId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
