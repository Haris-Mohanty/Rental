import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../utils/db";
import User from "./schema";
import { z } from "zod";

// --- Zod schemas for validation ---
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  role: z.enum(["user", "admin"]).optional(),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"] as const), 
});

const actionSchema = z.enum(["signup", "signin"]);

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure DB connection inside handler
    const body = await req.json();

    // Validate action
    const action = actionSchema.parse(body.action);

    // --- SIGNUP ---
    if (action === "signup") {
      const parsed = signupSchema.parse(body);

      // Check if user already exists
      const existingUser = await User.findOne({ email: parsed.email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 422 }
        );
      }

      // Hash password
      const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");
      const hashedPassword = await bcrypt.hash(parsed.password, SALT_ROUNDS);

      // Default role = "user" if not provided
      const role = parsed.role || "user";

      const user = await User.create({
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        mobile: parsed.mobile,
        role,
      });

      // Exclude password in response
      const { password: _, ...userData } = user.toObject();

      return NextResponse.json(
        { success: true, message: "User created successfully", data: userData },
        { status: 201 }
      );
    }

    // --- SIGNIN ---
    if (action === "signin") {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return NextResponse.json(
          { success: false, message: "JWT_SECRET not found in .env" },
          { status: 500 }
        );
      }

      const parsed = signinSchema.parse(body);

      const user = await User.findOne({ email: parsed.email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(parsed.password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      // --- Role check (mandatory in signin) ---
      if (parsed.role !== user.role) {
        return NextResponse.json(
          {
            success: false,
            message: `Role mismatch: tried to login as "${parsed.role}" but account role is "${user.role}"`,
          },
          { status: 403 }
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
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Store token in HTTP-only cookie
      const response = NextResponse.json(
        {
          success: true,
          message: "Signed in successfully",
          data: { role: user.role, token },
        },
        { status: 200 }
      );

      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });

      return response;
    }

    // --- Invalid action ---
    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message).join(", ");
      return NextResponse.json(
        { success: false, message: messages },
        { status: 400 }
      );
    }

    console.error("Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
