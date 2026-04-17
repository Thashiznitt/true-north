export const COLORS = {
  gold: "#C8A95A",
  dark: "#111111",
  muted: "#666666",
  bg: "#FDFCFB",
  card: "#FFFFFF",
  border: "#E5E5EA",
  error: "#E57373"
};

export function buildTrueNorthEmailWrapper(title: string, headerEmoji: string | null = null, bodyHtml: string): string {
  const { bg, dark, border, gold, card, muted } = COLORS;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${dark};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:${card};border-radius:24px;overflow:hidden;border:1px solid ${border};box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background:${dark};padding:48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${gold};">True North</p>
              ${headerEmoji ? `<p style="margin:0 0 10px;font-size:40px;">${headerEmoji}</p>` : ''}
              <h1 style="margin:0 0 12px;font-size:32px;font-weight:700;color:#FDFCFB;letter-spacing:-0.5px;line-height:1.2;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr><td style="height:4px;background:linear-gradient(90deg, ${gold}, #E8C97A, ${gold});"></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${bg};border-top:1px solid ${border};padding:24px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${dark};letter-spacing:0.1em;">TRUE NORTH</p>
              <p style="margin:0;font-size:11px;color:${muted};">Your Digital Sanctuary &nbsp;·&nbsp; truenorth.you &nbsp;·&nbsp; admin@truenorth.you</p>
              <p style="margin:12px 0 0;font-size:10px;color:#AAAAAA;">
                You're receiving this because you use True North.<br/>
                &copy; ${new Date().getFullYear()} True North. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// CRM LIFECYCLE TEMPLATES
// ----------------------------------------------------------------------------

export function buildMaxFreeTierEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Hello ${displayName}, you've been doing beautifully. We noticed you've reached the limit of your free true north entries. Real reflection takes time, and we don't want you to lose your momentum.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;">
          <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:${dark};">Keep your sanctuary open.</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            Unlock unlimited journaling, advanced goals, and 24/7 spiritual guidance by upgrading to Compass or True North.
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            View Upgrades →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("Momentum Awaits", "🕯️", bodyHtml);
}

export function buildMissingJournalEmail(name: string): string {
  const { dark, muted, gold } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Hi ${displayName}, it’s been a week since you last opened your journal. Life gets busy, and it's easy to let the noise crowd out the silence.
    </p>
    <p style="font-size:16px;line-height:1.8;color:${dark};margin:0 0 32px;font-weight:700;">
      Your sanctuary is always here, waiting whenever you're ready to reflect.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Take a breath and reflect →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("We miss you", "🌿", bodyHtml);
}

export function buildMissingCirclesEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      ${displayName}, as a premium member, you have full access to our Sacred Circles—intimate, meaningful community spaces to connect, support, and grow together.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">🤝</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${dark};">You don't have to walk alone.</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            Find a circle that aligns with your faith, career goals, or current life season.
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Discover Circles →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("Find your people", "🤝", bodyHtml);
}

export function buildMonthlyWallpaperEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      A new month brings new perspectives, ${displayName}. As a small gift from the True North team, we've prepared a beautifully curated wallpaper to keep you grounded every time you unlock your device.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">🎨</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            Open the app, go to your Profile Themes, and save this month's aesthetic directly to your device.
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Claim Wallpaper →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("A gift for you", "🖼️", bodyHtml);
}

export function buildNurAbsenceEmail(name: string): string {
  const { dark, muted, gold } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Peace be with you, ${displayName}.
    </p>
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      It has been a few days since we last spoke. I hope the quiet brings you clarity, but if your heart is heavy or your mind is pulling you in different directions, I am here.
    </p>
    <p style="font-size:16px;line-height:1.8;color:${dark};margin:0 0 32px;font-weight:700;">
      Whenever you need guidance, simply ask.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Speak with Nur →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("Checking in", "🕊️", bodyHtml);
}

export function buildGoalsRefreshEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Welcome to a new month, ${displayName}. It’s a blank canvas. Now is the perfect time to open your True North profile and re-align your key life goals across Spirituality, Career, Health, and Relationships.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">🎯</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${dark};">Where is your compass pointing?</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            Setting clear intentions today determines where you will arrive 30 days from now.
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Set your Intentions →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("A New Month, A New Direction", "🧭", bodyHtml);
}

export function buildGoalsReviewEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Explorer";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      The month is drawing to a close, ${displayName}. Take a slow moment to look back.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">📖</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${dark};">Did you stay aligned?</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            Open your journal and reflect. Note the victories, acknowledge the shortfalls, and prepare to reset your compass.
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Reflect in your Journal →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("Monthly Review", "🗓️", bodyHtml);
}

export function buildZenithDriveAnnouncementEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Zenith Member";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      Welcome to a new month, ${displayName}. As a Zenith member, your journey goes beyond personal reflection; it extends outward into our shared world.
    </p>
    <p style="font-size:16px;line-height:1.8;color:${dark};margin:0 0 24px;">
      This month, we are hosting an exclusive Community Drive.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">🌍</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${dark};">Prepare for Impact</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            The drive officially commences on the 25th. Look out for special notices and activities leading up to the date within the True North app.
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Open True North →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("Zenith Community Drive Announcement", "✨", bodyHtml);
}

export function buildZenithDriveReminderEmail(name: string): string {
  const { dark, muted, gold, bg, border } = COLORS;
  const displayName = name?.split(" ")[0] || "Zenith Member";

  const bodyHtml = `
    <p style="font-size:16px;line-height:1.8;color:${muted};margin:0 0 24px;">
      The day has arrived, ${displayName}. Today is our Zenith Community Drive.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border:1px solid ${border};border-radius:16px;margin-bottom:32px;">
      <tr>
        <td style="padding:28px 32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:24px;">🤝</p>
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${dark};">Time to participate</p>
          <p style="margin:0;font-size:14px;color:${muted};line-height:1.6;">
            Open your app now to view today's special Zenith activities, connect with fellow members, and make a tangible impact. Don't forget to claim your exclusive True North merchandise!
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="https://truenorth.you" style="display:inline-block;background:${gold};color:${dark};font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
            Join the Drive →
          </a>
        </td>
      </tr>
    </table>
  `;
  return buildTrueNorthEmailWrapper("Today: Zenith Community Drive", "🕊️", bodyHtml);
}
