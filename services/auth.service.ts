import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";
import crypto from "crypto";
import { resend } from "@/lib/mail";
type RegisterUserResult = AuthResponse;

const mailFrom = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendVerificationEmail(params: {
  email: string;
  name: string;
  token: string;
}) {
  const { email, name, token } = params;

  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const { error } = await resend.emails.send({
    from: mailFrom,
    to: email,
    subject: "Verify your email",
    html: `<p>Hello ${name},</p><p>Please verify your email by clicking the link below.</p><p><a href="${appUrl}/api/verify?token=${token}">Verify Email</a></p>`,
  });

  if (error) {
    throw new Error(error.message);
  }
}


type LoginUserRecord = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  isHost: boolean;
  isHostApproved: boolean;
};

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwtSecret;
}

function buildAuthResponse(user: {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
  isHost: boolean;
  isHostApproved: boolean;
  host?: {
    businessName: string | null;
  } | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    businessName: user.host?.businessName ?? null,
    role: user.role,
    isHost: user.isHost,
    isHostApproved: user.isHostApproved,
  };
}

export const registerUser = async (
  data: RegisterInput,
): Promise<RegisterUserResult> => {
  const { name, email, password, phone, role, businessName } = data;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRole = role === "admin" ? "ADMIN" : "USER";
  const wantsHostAccess = role === "host";
  const verifyToken = crypto.randomBytes(32).toString("hex");
   console.log("Registering user with data:", {
    name,
    email: normalizedEmail,
    role: normalizedRole,
    verifyToken,
  });
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      password: hashed,
      role: normalizedRole,
      isHost: wantsHostAccess,
      verificationToken: verifyToken,
      isVerified: false,
    },
  });

  await sendVerificationEmail({
    email: normalizedEmail,
    name: name.trim(),
    token: verifyToken,
  });

  if (wantsHostAccess) {
    await prisma.host.create({
      data: {
        userId: user.id,
        businessName: businessName?.trim() || null,
      },
    });
  }

  return {
  user: buildAuthResponse({ ...user, host: null }),
};
};


export const LoginUser=async(data:LoginInput):Promise<AuthResponse&{token:string}>=>{
  const {email,password}=data
  const normalizedEmail = email.trim().toLowerCase();
  const jwtSecret = getJwtSecret();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } }) as LoginUserRecord | null;
  if(!user){
    throw new Error("User not found");
  }
  if (!user.password) {
    throw new Error("This account does not have a password set");
  }
  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }
  const isValidPassword=await bcrypt.compare(password,user.password);
  if(!isValidPassword){
    throw new Error("Invalid password");
  }
  
  const token=jwt.sign(
    {
      id:user.id,
      role:user.role,
      isHost:user.isHost,
      isHostApproved:user.isHostApproved,
    },
    jwtSecret,
    {expiresIn:"7d"}
  );

  return{
    user:buildAuthResponse({
      ...user,
      host: null,
    }),
    token,
  }

};


export const RequestResetPassword=async(email:string)=>{
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } }) as LoginUserRecord | null;
  if(!user){
    throw new Error("User not found");
  }
  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  if (resend) {
    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const { error } = await resend.emails.send({
      from: mailFrom,
      to: normalizedEmail,
      subject: "Reset your password",
      html: `<p>Hello ${user.name},</p><p>Please reset your password by clicking the link below.</p><p><a href="${appUrl}/api/reset-password?token=${resetToken}">Reset Password</a></p>`,
    });

    if (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return{
    message:"Password reset email sent. Please check your inbox."  
  }
}


export const ResetPassword=async(token:string,newPassword:string)=>{
  const user = await (prisma.user as any).findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  }) as LoginUserRecord | null;

  if(!user){
    throw new Error("Invalid or expired reset token");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  return {
    message: "Password reset successfully. You can now log in.",
  };
}