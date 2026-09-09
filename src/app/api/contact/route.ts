import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  message: z.string().min(10).max(2000),
  company: z.string().optional().nullable(), // honeypot — must stay empty
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all fields correctly." },
        { status: 400 }
      );
    }

    // honeypot filled → silently accept without storing (bot)
    if (parsed.data.company) {
      return NextResponse.json({ ok: true });
    }

    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
