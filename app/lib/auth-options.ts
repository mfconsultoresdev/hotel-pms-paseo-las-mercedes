
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            hotel: true,
            role: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        if (!user.is_active) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || `${user.first_name} ${user.last_name}`,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role?.name,
          hotelId: user.hotel_id,
          hotelName: user.hotel?.name,
          employeeId: user.employee_id,
          position: user.position,
          department: user.department,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.hotelId = user.hotelId;
        token.hotelName = user.hotelName;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.employeeId = user.employeeId;
        token.position = user.position;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.hotelId = token.hotelId as string;
        session.user.hotelName = token.hotelName as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.employeeId = token.employeeId as string;
        session.user.position = token.position as string;
        session.user.department = token.department as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
