import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../utils/db";
import User from "../schema";

interface JwtPayload {
  id: string;
  role: "user" | "admin";
  email: string;
  mobile: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "JWT_SECRET not found in .env" },
        { status: 500 }
      );
    }

    // --- Parse cookies ---
    const cookieHeader = req.headers.get("cookie") ?? "";
    const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
    const token = cookies["token"];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found, please login" },
        { status: 401 }
      );
    }

    // --- Verify token ---
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // --- Fetch user ---
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("Fetch User Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
