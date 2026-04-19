/** Always works without Supabase. Override in Vercel: VITE_WHATSAPP_GROUP_LINK */
const DEFAULT_WHATSAPP_GROUP =
  'https://chat.whatsapp.com/EjMa1pW13ib1OOAITnCOXj?mode=gi_t'

function getWhatsappUrl() {
  const fromEnv = import.meta.env.VITE_WHATSAPP_GROUP_LINK
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim()
  }
  return DEFAULT_WHATSAPP_GROUP
}

export function SuccessScreen() {
  const whatsappUrl = getWhatsappUrl()

  return (
    <div className="success-page" role="status" aria-live="polite">
      <h1 className="success-page__headline">Application received.</h1>

      <div className="success-page__message">
        <p>
          We&apos;ve got your details. We&apos;ll message you on WhatsApp shortly to guide you through the next steps.
        </p>
        <p className="success-page__message-secondary">
          You can also{' '}
          <a
            className="success-page__whatsapp-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            join the WhatsApp group
          </a>{' '}
          to stay updated.
        </p>
      </div>
    </div>
  )
}
