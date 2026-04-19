import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'techascend_cookie_consent'
const ACCEPTED_VALUE = 'accepted'

function initialBannerVisible() {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(STORAGE_KEY) !== ACCEPTED_VALUE
  } catch {
    return true
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(initialBannerVisible)

  useEffect(() => {
    if (visible) {
      document.documentElement.classList.add('cookie-banner-visible')
    } else {
      document.documentElement.classList.remove('cookie-banner-visible')
    }
    return () => document.documentElement.classList.remove('cookie-banner-visible')
  }, [visible])

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, ACCEPTED_VALUE)
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <div className="cookie-banner__inner">
        <p className="cookie-banner__text">
          We use cookies to improve your experience and analyse site traffic. By clicking
          &quot;Accept&quot;, you agree to our use of cookies as described in our{' '}
          <Link className="cookie-banner__policy-link" to="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
        <button type="button" className="cookie-banner__accept" onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  )
}
