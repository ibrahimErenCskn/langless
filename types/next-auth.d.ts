import NextAuth from "next-auth";

// Session ve User türlerini genişletiyoruz
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      emailVerified?: Date;
    };
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    emailVerified?: Date;
  }
}
