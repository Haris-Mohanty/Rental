// src/app/api/request-callback/route.ts
import connectDB from "../utils/db";
import CallbackRequest from "@/app/api/CallbackRequest/schema";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { phone, countryCode, dialCode, country, location, timestamp } = body;

    // ✅ Mandatory: phone & countryCode & country
    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    // ✅ Phone must contain only numbers
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Phone number must contain only digits" },
        { status: 400 }
      );
    }

    // Ensure location matches schema
    const formattedLocation = location
      ? {
          coords: location.coords || "",
          address: location.address || "",
        }
      : undefined;

    const newRequest = new CallbackRequest({
      phone,
      country,
      countryCode,
      dialCode,
      location: formattedLocation,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await newRequest.save();

    // ✅ Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Banaja Travels" <${process.env.SMTP_USER}>`,
      to: "service@banajatravels.com",
      subject: "New Callback Request",
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Callback Request</title>
  </head>
  <body style="margin:0; padding:0; font-family:'Arial', sans-serif; background-color:#f5f6fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
            
            <!-- Header with Gradient -->
            <tr>
              <td style="background: linear-gradient(90deg, #6b46c1, #9f7aea); padding:30px; text-align:center; color:#ffffff;">
                <img src="https://banajatravles.com/logo.png" alt="Banaja Travels" width="80" style="margin-bottom:15px;">
                <h1 style="margin:0; font-size:28px;">Banaja Travels</h1>
                <p style="margin:5px 0 0; font-size:16px;">New Callback Request</p>
                <span style="display:inline-block; margin-top:10px; background-color:#facc15; color:#000; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:bold;">NEW REQUEST</span>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    {
                      label: "Phone",
                      value: `${dialCode ? `${dialCode} ` : ""}${phone}`,
                    },
                    { label: "Country", value: country },
                    {
                      label: "Location",
                      value: formattedLocation?.address || "N/A",
                    },
                    {
                      label: "Coordinates",
                      value: formattedLocation?.coords || "N/A",
                    },
                    {
                      label: "Timestamp",
                      value: new Date(
                        timestamp ? timestamp : Date.now()
                      ).toLocaleString(),
                    },
                  ]
                    .map(
                      (field) => `
                    <tr>
                      <td style="padding:10px 0; border-bottom:1px solid #f0f0f0;">
                        <strong style="color:#6b46c1;">${field.label}:</strong>
                        <span style="margin-left:8px; color:#333;">${field.value}</span>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>

                <p style="margin-top:25px; font-size:14px; color:#555; line-height:1.5;">
                  This is an automated notification from <strong>Banaja Travels</strong>. Please do not reply to this email.
                </p>

                <!-- CTA Button -->
                <p style="text-align:center; margin-top:25px;">
                  <a href="https://banajatravels.com/" style="background-color:#6b46c1; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:8px; display:inline-block; font-weight:bold;">
                    View Dashboard
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#888;">
                &copy; ${new Date().getFullYear()} Banaja Travels. All rights reserved.
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Callback request submitted successfully",
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving callback request:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Optional: Handle other methods with 405
export async function handler(req: NextRequest) {
  switch (req.method) {
    case "POST":
      return await POST(req);
    default:
      return NextResponse.json(
        { success: false, message: "Method not allowed" },
        { status: 405 }
      );
  }
}
