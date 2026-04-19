import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/services/auth.service";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

type GoogleAuthUser = {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  provider: string;
  verificationToken: string | null;
  isVerified: boolean;
  isHost: boolean;
  isHostApproved: boolean;
};

function getAppUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const appUrl = getAppUrl();

  if (!session?.user?.email) {
    return NextResponse.redirect(`${appUrl}/login`);
  }
  console.log("Google login session:", session);

  const { email, name } = session.user;

  let user = await prisma.user.findUnique({ where: { email } }) as GoogleAuthUser | null;
  let createdGoogleUser = false;

  if (!user) {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    user = await prisma.user.create({
      data: {
        email,
        name: name || "",
        provider: "google",
        verificationToken,
        isVerified: false,
      },
    }) as unknown as GoogleAuthUser;

    createdGoogleUser = true;
  }

  if (user.provider === "credentials") {
    return NextResponse.redirect(
      `${appUrl}/login?error=Use%20email%2Fpassword`
    );
  }

  if (!user.isVerified) {
    const verificationToken =
      user.verificationToken ?? crypto.randomBytes(32).toString("hex");

    if (!user.verificationToken) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken },
      }) as unknown as GoogleAuthUser;
    }
    console.log("token for verification:", verificationToken);
    await sendVerificationEmail({
      email: user.email,
      name: user.name || name || "there",
      token: verificationToken,
    });

    const message = createdGoogleUser
      ? "Verification email sent"
      : "Please verify your email";

    return NextResponse.redirect(
      `${appUrl}/login?message=${encodeURIComponent(message)}`
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isHost: user.isHost,
      isHostApproved: user.isHostApproved,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect(appUrl);

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}