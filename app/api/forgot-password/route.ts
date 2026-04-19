import { forgotPassword } from "@/controllers/auth.controller";

export async function POST(req:Request) {
  return forgotPassword(req as any);
}