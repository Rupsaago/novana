import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function confirmationEmail(firstName: string, feature: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Novana waitlist</title>
</head>
<body style="margin:0;padding:0;background:#F7F2ED;font-family:Georgia,serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F2ED;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo row -->
          <tr>
            <td style="padding:0 0 28px 0;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#8A7DBC,#7B6FA8,#6B5A95);text-align:center;vertical-align:middle;color:#fff;font-family:Georgia,serif;font-size:16px;font-weight:400;letter-spacing:-0.01em;">
                    n
                  </td>
                  <td style="padding-left:10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#5A5080;letter-spacing:-0.02em;font-style:italic;">
                    novana
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#FFFCF7;border:1px solid rgba(255,255,255,0.8);border-radius:24px;padding:48px 48px 40px;box-shadow:0 10px 36px rgba(123,111,168,0.12);">

              <!-- Eyebrow -->
              <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#7B6FA8;font-style:normal;">
                ✦ Waitlist confirmed
              </p>

              <!-- Heading -->
              <h1 style="margin:0 0 28px;font-family:Georgia,serif;font-size:34px;font-weight:400;color:#2F2A28;line-height:1.1;letter-spacing:-0.025em;font-style:italic;">
                You're on the Novana waitlist. ✦
              </h1>

              <!-- Body -->
              <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:16px;color:#6F6A66;line-height:1.7;">
                Thank you for signing up for <strong style="color:#2F2A28;font-weight:500;">${feature}</strong> — we'll be in touch soon.
              </p>
              <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:16px;color:#6F6A66;line-height:1.7;">
                Novana is being built with care, and people like you are exactly who we're building it for. When <strong style="color:#2F2A28;font-weight:500;">${feature}</strong> is ready, you'll be among the first to know.
              </p>
              <p style="margin:0 0 32px;font-family:Georgia,serif;font-size:16px;color:#6F6A66;line-height:1.7;">
                In the meantime, if you haven't already, you can create a free Novana account and start tracking your PMOS symptoms today.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 36px;">
                <tr>
                  <td style="border-radius:999px;background:linear-gradient(135deg,#8A7DBC 0%,#7B6FA8 55%,#6B5A95 100%);box-shadow:0 6px 24px rgba(123,111,168,0.36);">
                    <a href="https://novana-eight.vercel.app/auth/signup"
                       style="display:inline-block;padding:14px 30px;font-family:Georgia,serif;font-size:15px;font-weight:600;color:#fff;text-decoration:none;border-radius:999px;letter-spacing:0.01em;">
                      Create your account →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="margin:0;font-family:Georgia,serif;font-size:16px;color:#2F2A28;font-style:italic;line-height:1.6;">
                — Rupsaa &amp; the Novana team ♡
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;font-family:Georgia,serif;font-size:11px;color:#6F6A66;letter-spacing:0.04em;font-style:italic;line-height:1.8;">
              Not medical advice &nbsp;·&nbsp; Private by design &nbsp;·&nbsp; © 2026 Novana
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { email, feature } = await req.json()
    if (!email || !feature) {
      return NextResponse.json({ error: 'email and feature are required' }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()

    const supabase = createServerClientInstance()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('waitlist')
      .insert({ email: trimmedEmail, feature })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'already_on_list' }, { status: 409 })
      }
      console.error('[POST /api/waitlist] db error:', error)
      return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 })
    }

    // Derive first name from email prefix (before @, before dots/numbers)
    const emailPrefix = trimmedEmail.split('@')[0]
    const firstName = emailPrefix
      .split(/[._\-0-9]/)[0]
      .replace(/[^a-zA-Z]/g, '')
    const greeting = firstName.length >= 2
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
      : 'there'

    // Send confirmation email — non-blocking; failure doesn't break signup
    try {
      await resend.emails.send({
        from: 'Novana <onboarding@resend.dev>',
        to: trimmedEmail,
        subject: `You're on the list, ${greeting} ✦`,
        html: confirmationEmail(greeting, feature),
      })
    } catch (emailErr) {
      console.error('[POST /api/waitlist] email send failed (non-fatal):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/waitlist]', err)
    return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 })
  }
}
