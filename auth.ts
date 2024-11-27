import NextAuth, { User } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { prisma } from "./lib/prisma"


export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user, trigger, session }) {

            if (user) {
                token.user = user;
            }
            if (trigger === "update" && session) {
                const currentUser = await prisma.user.findUnique({
                    where: { id: session.user.id },
                })
                token = { ...token, user: { ...session.user, image: currentUser?.image, name: currentUser?.name } };
                return token;
            };
            return token;
        },
        async session({ session, token, user }) {
            //type eklenecek
            session.user = token.user as any
            return session;
        },
    }
})