import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      if (!user.email) return;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        });

        if (insertError) {
          console.error("Error adding user to the database", insertError);
        }
      }
    },
  },
};
