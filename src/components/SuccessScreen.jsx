import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'
import { useIsMobile } from '../hooks/useIsMobile'

export function SuccessScreen() {
  const isMobile = useIsMobile()
  const [whatsappUrl, setWhatsappUrl] = useState(null)
  const [linkStatus, setLinkStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!supabase) {
        setLinkStatus('error')
        setWhatsappUrl(null)
        return
      }
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'whatsapp_group_link')
        .maybeSingle()

      if (cancelled) return
      if (error || !data?.value) {
        setLinkStatus('error')
        setWhatsappUrl(null)
        return
      }
      setWhatsappUrl(data.value)
      setLinkStatus('ready')
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const linkReady = linkStatus === 'ready' && whatsappUrl && whatsappUrl !== '#'

  return (
    <div className="success-page" role="status" aria-live="polite">
      <h1 className="success-page__headline">Application received</h1>

      <div className="success-page__message">
        <p>We’ve received your application.</p>
        <p>
          Join the WhatsApp group to continue. All updates will be shared there.
        </p>
      </div>

      <div className="success-page__cta">
        {linkStatus === 'loading' && (
          <p className="success-page__muted">Loading WhatsApp link…</p>
        )}
        {linkStatus === 'error' && (
          <p className="success-page__muted">
            WhatsApp link isn’t available right now. We’ll follow up with you
            shortly.
          </p>
        )}
        {linkReady && isMobile && (
          <a
            className="success-page__btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join WhatsApp Group
          </a>
        )}
        {linkReady && !isMobile && (
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
        )}
      </div>

      <p className="success-page__closing">
        Our team will review your application and reach out to you shortly via
        WhatsApp.
      </p>
    </div>
  )
}
