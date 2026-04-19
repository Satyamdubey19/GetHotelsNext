import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function getGoogleConfig() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ?? process.env.Google_Client_ID;
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET ?? process.env.Google_Client_Secret;

  if (!clientId || !clientSecret) {
    throw new Error("Google auth environment variables are not configured");
  }

  return { clientId, clientSecret };
}

const googleConfig = getGoogleConfig();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};