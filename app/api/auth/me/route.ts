import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = verifyJwt(token);

    if (!payload) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { host: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isHost: user.isHost,
        isHostApproved: user.isHostApproved,
        businessName: user.host?.businessName ?? null,
        provider: user.provider,
      },
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}