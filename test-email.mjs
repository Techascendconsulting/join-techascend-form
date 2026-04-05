import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { Resend } from 'resend'

loadEnv({ path: '.env.local', override: true })

const apiKey = process.env.RESEND_API_KEY
const to =
  process.env.TEST_EMAIL_TO ||
  process.argv[2] ||
  ''

if (!apiKey) {
  console.error('RESEND_API_KEY is missing. Add it to .env or .env.local.')
  process.exit(1)
}

if (!to) {
  console.error(
    'Recipient missing. Set TEST_EMAIL_TO or run:\n  npm run test:email -- you@example.com',
  )
  process.exit(1)
}

const resend = new Resend(apiKey)

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to,
  subject: 'Resend test (test-email.mjs)',
  text: 'This is a test email from test-email.mjs.',
  html: '<p>This is a test email from <code>test-email.mjs</code>.</p>',
})

console.log('data:', data === undefined ? '(undefined)' : JSON.stringify(data, null, 2))
console.log('error:', error === undefined || error === null ? '(none)' : error)

if (error) {
  process.exit(1)
}
