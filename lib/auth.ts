import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import College from "@/models/College";
import Company from "@/models/Company";
import Student from "@/models/Student";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        let user;
        let Model;

        // Select appropriate model based on role
        switch (credentials.role) {
          case "admin":
            Model = Admin;
            break;
          case "college":
            Model = College;
            break;
          case "company":
            Model = Company;
            break;
          case "student":
            Model = Student;
            break;
          default:
            throw new Error("Invalid role");
        }

        user = await Model.findOne({ email: credentials.email }).lean();

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if company is approved
        if (credentials.role === "company" && !user.isApproved) {
          throw new Error("Your account is pending admin approval");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || `${user.firstName} ${user.lastName}` || user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};