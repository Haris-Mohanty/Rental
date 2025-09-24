import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../utils/db";
import User from "./schema";
import { z } from "zod";

// Await DB connection
await connectDB();

// Zod schemas for validation
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Action validation
const actionSchema = z.enum(["signup", "signin"]);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate action
    const action = actionSchema.parse(body.action);

    // SIGNUP
    if (action === "signup") {
      const parsed = signupSchema.parse(body);

      // Check if user exists
      const existingUser = await User.findOne({ email: parsed.email });
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      // Hash password
      const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");
      const hashedPassword = await bcrypt.hash(parsed.password, SALT_ROUNDS);

      // Create user
      const user = await User.create({
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        mobile: parsed.mobile,
        role: "user", // default role
      });

      // Remove password from response
      const { password, ...userData } = user.toObject();
      return NextResponse.json({ user: userData });
    }

    // SIGNIN
    if (action === "signin") {
      const parsed = signinSchema.parse(body);

      const user = await User.findOne({ email: parsed.email });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(parsed.password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          email: user.email,
          mobile: user.mobile,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return NextResponse.json({ message: "Signed in", token });
    }

    // Fallback
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message).join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    // Other errors
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
