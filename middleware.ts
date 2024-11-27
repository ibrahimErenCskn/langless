import { NextRequest, NextResponse } from "next/server"
import authConfig from "./auth.config"
import NextAuth from "next-auth"
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
    const session = await auth();
    if (!session && req.nextUrl.pathname.startsWith('/profile')) {
        return NextResponse.redirect(new URL('/', req.url))
    }
})

export const config = {
    matcher: ['/profile'],
}