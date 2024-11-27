import type { NextAuthConfig } from "next-auth"
import credentials from "next-auth/providers/credentials"
import { compare, hash } from 'bcryptjs';
import google from "next-auth/providers/google"
import { prisma } from "./lib/prisma";
import { z } from 'zod';

const credentialsSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
})

export default {
    providers:
        [
            google({
                allowDangerousEmailAccountLinking: true
            }),
            credentials({
                credentials: {
                    email: {},
                    password: {},
                },
                async authorize(credentials) {
                    try {
                        if (!credentials) return Promise.reject(new Error('Email and password are required.'));

                        const { email, password } = await credentialsSchema.parseAsync(credentials);

                        // Kullanıcıyı veritabanında bul
                        const user = await prisma.user.findUnique({
                            where: { email },
                        });

                        if (!user) {
                            return Promise.reject(new Error('No user found with this email.'));
                        }

                        // Şifre doğrulama
                        const isValidPassword = await compare(password, user.password || "");
                        if (!isValidPassword) {
                            throw new Error(JSON.stringify({ code: 'INVALID_PASSWORD', message: 'Incorrect password. Please try again.' }));
                        }

                        return { id: user.id, email: user.email, name: user.name };
                    } catch (error) {
                        console.error('Error authorizing user:', error);
                        return Promise.reject(error);
                    }
                },
            })
        ]
} satisfies NextAuthConfig