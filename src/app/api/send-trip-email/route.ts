import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mobile, email, pickupCity, duration, pickupDate, pickupTime } =
      body;

    if (!mobile || !pickupCity || !duration || !pickupDate || !pickupTime) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

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
      subject: "🚖 New Local Trip Request",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Trip Request</title>
      </head>
      <body style="margin:0; padding:0; font-family:'Arial', sans-serif; background-color:#f5f6fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
          <tr>
            <td align="center">

              <!-- Main Card -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(90deg, #257ce0, #60b2ff); padding:30px; text-align:center; color:#ffffff;">
                    <img src="https://banajatravles.com/logo.png" alt="Banaja Travels" width="80" style="margin-bottom:15px;">
                    <h1 style="margin:0; font-size:26px;">Banaja Travels</h1>
                    <p style="margin:5px 0 0; font-size:16px;">New Local Trip Request</p>
                    <span style="display:inline-block; margin-top:10px; background-color:#facc15; color:#000; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:bold;">NEW TRIP</span>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${[
                        { label: "Mobile", value: mobile },
                        { label: "Email", value: email || "N/A" },
                        { label: "Pickup City", value: pickupCity },
                        { label: "Duration", value: duration },
                        { label: "Pickup Date", value: pickupDate },
                        { label: "Pickup Time", value: pickupTime },
                      ]
                        .map(
                          (field) => `
                          <tr>
                            <td style="padding:10px 0; border-bottom:1px solid #f0f0f0;">
                              <strong style="color:#257ce0;">${field.label}:</strong>
                              <span style="margin-left:8px; color:#333;">${field.value}</span>
                            </td>
                          </tr>
                        `
                        )
                        .join("")}
                    </table>

                    <p style="margin-top:25px; font-size:14px; color:#555; line-height:1.5;">
                      This is an automated notification from <strong>Banaja Travels</strong>. Please do not reply directly to this email.
                    </p>

                    <!-- CTA Button -->
                    <p style="text-align:center; margin-top:25px;">
                      <a href="https://banajatravels.com/" style="background-color:#257ce0; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:8px; display:inline-block; font-weight:bold;">
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

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Nodemailer error:", err);
    return new Response(JSON.stringify({ message: "Failed to send email" }), {
      status: 500,
    });
  }
}
