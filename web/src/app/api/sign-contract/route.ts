import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_CC = ["remyngatia@gmail.com", "sarahwarioguyo@gmail.com"];

// ─── Branded email HTML ────────────────────────────────────────────
function buildContractEmail({
  fullName,
  email,
  referenceCode,
  signedAt,
  commencementDate,
  idNumber,
  isAdmin,
}: {
  fullName: string;
  email: string;
  referenceCode: string;
  signedAt: string;
  commencementDate: string;
  idNumber?: string;
  isAdmin: boolean;
}) {
  const gold = "#C8A95A";
  const dark = "#111111";
  const muted = "#666666";
  const bg = "#FDFCFB";
  const card = "#FFFFFF";
  const border = "#E5E5EA";

  const greeting = isAdmin
    ? `A new contract has been signed by <strong>${fullName}</strong> (${email}).`
    : `Dear ${fullName},<br/><br/>Your Influencer Partnership Contract with <strong>True North</strong> has been successfully signed and is now legally binding.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>True North – Contract Signed</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:${dark};padding:36px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:${gold};">True North</p>
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#FDFCFB;letter-spacing:-0.5px;">Partnership Contract</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">Referral &amp; Content Distribution Agreement</p>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr><td style="height:4px;background:${gold};"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px;">

              <!-- Status badge -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#F0FAF0;border:1px solid #C3E6C3;border-radius:100px;padding:8px 20px;">
                    <span style="font-size:13px;font-weight:700;color:#2D7D2D;">✓ &nbsp;Contract Signed &amp; Saved</span>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:1.7;color:${muted};margin:0 0 32px;">${greeting}</p>

              <!-- Contract Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
                <tr>
                  <td style="padding:28px 32px;">
                    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${gold};">Contract Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;color:${muted};width:40%;">Reference</td>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;font-weight:700;color:${dark};">${referenceCode}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;color:${muted};">Signatory</td>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;font-weight:700;color:${dark};">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;color:${muted};">Email</td>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;font-weight:700;color:${dark};">${email}</td>
                      </tr>
                      ${idNumber ? `<tr>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;color:${muted};">National ID / Passport</td>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;font-weight:700;color:${dark};">${idNumber}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;color:${muted};">Signed At</td>
                        <td style="padding:10px 0;border-bottom:1px solid ${border};font-size:13px;font-weight:700;color:${dark};">${new Date(signedAt).toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "long", timeStyle: "short" })}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;font-size:13px;color:${muted};">Commencement</td>
                        <td style="padding:10px 0;font-size:13px;font-weight:700;color:${gold};">${commencementDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Key obligation reminder (only for signatory) -->
              ${!isAdmin ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8EC;border:1px solid #F0D89A;border-radius:16px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${gold};">Key Obligation Reminder</p>
                    <p style="margin:0;font-size:14px;color:${dark};line-height:1.7;">
                      Every post on your channels must end with the True North referral download links:<br/>
                      <br/>
                      <span style="font-family:monospace;font-size:12px;color:${gold};background:rgba(200,169,90,0.1);padding:4px 8px;border-radius:6px;display:inline-block;word-break:break-all;">https://truenorth.you/r/grace-kinuthia</span><br/>
                      <br/>
                      Failure to include these links constitutes a breach of contract and may result in revenue forfeiture. Please refer to Section 5 of your agreement.
                    </p>
                  </td>
                </tr>
              </table>
              ` : ""}

              <p style="font-size:13px;color:${muted};line-height:1.7;margin:0 0 8px;">
                Questions? Contact the True North team at <a href="mailto:admin@truenorth.you" style="color:${gold};text-decoration:none;">admin@truenorth.you</a>
              </p>
              <p style="font-size:13px;color:${muted};line-height:1.7;margin:0;">
                Legal queries: <a href="mailto:walter@kadvocates.co.ke" style="color:${gold};text-decoration:none;">walter@kadvocates.co.ke</a> — K'ANJEJO &amp; COMPANY ADVOCATES
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${bg};border-top:1px solid ${border};padding:24px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${dark};letter-spacing:0.1em;">TRUE NORTH</p>
              <p style="margin:0;font-size:11px;color:${muted};">Your Digital Sanctuary &nbsp;·&nbsp; truenorth.you &nbsp;·&nbsp; admin@truenorth.you</p>
              <p style="margin:12px 0 0;font-size:10px;color:#AAAAAA;">Prepared &amp; reviewed by K'Anjejo &amp; Company Advocates, Nairobi, Kenya</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Route handler ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, idNumber, signatureData, commencementDate, referenceCode } = body;

    if (!fullName || !email || !signatureData || !commencementDate || !referenceCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Save to DB via Prisma
    const contract = await prisma.signedContract.create({
      data: {
        referenceCode,
        contractType: "influencer_partnership",
        fullName,
        email,
        idNumber: idNumber || null,
        signatureData,
        commencementDate: new Date(commencementDate),
        contractVersion: "1.0",
        agreedToTerms: true,
        emailSent: false,
      },
    });

    const signedAt = contract.signedAt.toISOString();

    const emailParams = { fullName, email, referenceCode, signedAt, commencementDate, idNumber };

    // Send email to signatory
    const signatoryEmail = buildContractEmail({ ...emailParams, isAdmin: false });
    // Send email to admins
    const adminEmail = buildContractEmail({ ...emailParams, isAdmin: true });

    const emailResults = await Promise.allSettled([
      // To signatory
      resend.emails.send({
        from: "True North <onboarding@resend.dev>",
        to: [email],
        subject: `✓ Contract Signed – True North Partnership (${referenceCode})`,
        html: signatoryEmail,
      }),
      // To admins (CC'd on all contracts)
      resend.emails.send({
        from: "True North <onboarding@resend.dev>",
        to: ADMIN_CC,
        subject: `[New Signature] ${fullName} signed the partnership contract – ${referenceCode}`,
        html: adminEmail,
      }),
    ]);

    // Mark email as sent if at least signatory email succeeded
    const signatoryResult = emailResults[0];
    if (signatoryResult.status === "fulfilled" && !signatoryResult.value.error) {
      await prisma.signedContract.update({
        where: { id: contract.id },
        data: { emailSent: true, emailSentAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      referenceCode: contract.referenceCode,
      signedAt,
    });
  } catch (err) {
    console.error("Contract signing error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
