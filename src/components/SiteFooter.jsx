import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__links" aria-label="Legal">
        <Link className="site-footer__link" to="/privacy">
          Privacy Policy
        </Link>
        <span className="site-footer__sep" aria-hidden="true">
          ·
        </span>
        <Link className="site-footer__link" to="/terms">
          Terms of Use
        </Link>
      </nav>
      <p className="site-footer__contact">
        Questions? Reach us at{' '}
        <a href="mailto:admin@techascendconsulting.com">admin@techascendconsulting.com</a>
      </p>
    </footer>
  )
}
