import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

let resendClient = null
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!resendClient) resendClient = new Resend(key)
  return resendClient
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getJsonBody(req) {
  if (req.body != null && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = getJsonBody(req)
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!email || !name) {
      return res.status(400).json({ ok: false, error: 'Missing email or name' })
    }

    const supabase = getSupabaseAdmin()
    let whatsappLink = ''

    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'whatsapp_group_link')
        .maybeSingle()
      if (error) {
        console.error('Supabase settings:', error.message)
      } else if (data?.value) {
        whatsappLink = data.value
      }
    } else {
      console.warn('Supabase not configured (SUPABASE_URL + key) on send-email API')
    }

    const resend = getResend()
    if (!resend) {
      console.warn('RESEND_API_KEY not set; skipping send')
      return res.status(200).json({ ok: true, emailSent: false })
    }

    const safeName = escapeHtml(name)
    const linkParagraph =
      whatsappLink && whatsappLink !== '#'
        ? `<a href="${String(whatsappLink).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">${escapeHtml(whatsappLink)}</a>`
        : 'We’ll send the link shortly.'

    const html = `<p>Hi ${safeName},</p><p>We’ve received your application.</p><p>Join the WhatsApp group to continue:</p><p>${linkParagraph}</p><p>We’ll review your application and contact you shortly.</p>`

    const textPlain = `Hi ${name},

We've received your application.

Join the WhatsApp group to continue:
${whatsappLink || "We'll send the link shortly."}

We'll review your application and contact you shortly.`

    try {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Application received',
        html,
        text: textPlain,
      })

      if (error) {
        console.error('Resend error:', error)
        return res.status(200).json({ ok: true, emailSent: false })
      }

      return res.status(200).json({ ok: true, emailSent: true })
    } catch (err) {
      console.error('Email send failed:', err)
      return res.status(200).json({ ok: true, emailSent: false })
    }
  } catch (err) {
    console.error('send-email route failed:', err)
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Server error',
    })
  }
}
