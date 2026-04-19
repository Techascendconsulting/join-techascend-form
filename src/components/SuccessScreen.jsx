import { QRCodeSVG } from 'qrcode.react'
import { useIsMobile } from '../hooks/useIsMobile'

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
  const isMobile = useIsMobile()
  const whatsappUrl = getWhatsappUrl()

  return (
    <div className="success-page" role="status" aria-live="polite">
      <h1 className="success-page__headline">You&apos;re in — thanks</h1>

      <div className="success-page__message">
        <p>We&apos;ve got your details.</p>
        <p>
          Join the WhatsApp group for the free 2-week experience. Updates and next steps will be
          shared there.
        </p>
      </div>

      <div className="success-page__cta">
        {isMobile && (
          <a
            className="success-page__btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join WhatsApp Group
          </a>
        )}
        {!isMobile && (
          <>
            <div className="success-page__qr">
              <QRCodeSVG
                value={whatsappUrl}
                size={200}
                level="M"
                includeMargin
                bgColor="var(--surface)"
                fgColor="var(--text-heading)"
              />
            </div>
            <a
              className="success-page__link-open"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp group
            </a>
          </>
        )}
      </div>

      <p className="success-page__closing">
        Our team will review your response and reach out shortly via WhatsApp.
      </p>
    </div>
  )
}
