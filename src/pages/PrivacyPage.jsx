import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — Tech Ascend Consulting'
  }, [])

  return (
    <div className="page page--legal">
      <header className="page__header page__header--legal">
        <p className="page__eyebrow">Tech Ascend Consulting</p>
        <h1 className="page__title">Privacy Policy</h1>
        <p className="page__lede page__lede--legal">
          How TechAscend Consulting handles personal information for this site. Last updated: April
          2026.
        </p>
      </header>

      <main className="card card--legal">
        <div className="legal-prose">
          <p>
            TechAscend Consulting (&quot;we&quot;, &quot;us&quot;) operates jointechascend.com and this
            registration experience. This policy explains what we collect, why, and your choices.
          </p>

          <h2 className="legal-prose__h2">Personal data we collect</h2>
          <p>When you use our form, we may collect:</p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your WhatsApp number</li>
            <li>Your responses to the form questions and any other fields you complete</li>
          </ul>

          <h2 className="legal-prose__h2">Why we use your data</h2>
          <p>We use this information to:</p>
          <ul>
            <li>Contact you about your application or enquiry</li>
            <li>Review suitability for our free 2-week Business Analyst experience</li>
            <li>Follow up about that experience and related programme opportunities we may offer</li>
            <li>Operate and improve how we run the programme and communicate with applicants</li>
          </ul>

          <h2 className="legal-prose__h2">We do not sell your personal data</h2>
          <p>
            We do not sell your personal information to third parties for their marketing purposes.
          </p>

          <h2 className="legal-prose__h2">Where and how data is processed</h2>
          <p>
            Your information may be stored and processed through our website, online forms, hosting
            providers, analytics tools (where used), email services, and WhatsApp or similar
            communication tools we use to stay in touch. Providers may process data on our behalf and
            under appropriate safeguards; we aim to work with reputable services only.
          </p>

          <h2 className="legal-prose__h2">Legal basis (UK)</h2>
          <p>
            We process your data to respond to your request, run the programme, and pursue our
            legitimate interests in managing applications and communications — balanced against your
            rights. Where we rely on consent (for example for certain cookies or marketing, if
            applicable), we will make that clear at the time.
          </p>

          <h2 className="legal-prose__h2">How long we keep information</h2>
          <p>
            We keep personal data only as long as needed for the purposes above, including follow-up
            about the experience and related opportunities, unless a longer period is required by law
            or for legitimate business needs (for example resolving disputes).
          </p>

          <h2 className="legal-prose__h2">Your rights and contacting us</h2>
          <p>
            Under UK GDPR you may have rights to access, correct, delete, or restrict processing of
            your personal data, and to object to certain processing. To exercise your rights or ask
            questions{' '}
            <strong>regarding your data</strong>, contact us at{' '}
            <a href="mailto:admin@techascendconsulting.com">admin@techascendconsulting.com</a>.
          </p>

          <h2 className="legal-prose__h2">Consent when you submit the form</h2>
          <p>
            By submitting the application form (including ticking the required consent box), you
            consent to us contacting you using the details you provide about your application, the
            free 2-week experience, and related programme information, in line with this policy.
          </p>

          <h2 className="legal-prose__h2">Cookies</h2>
          <p>
            We may use cookies and similar technologies as described when you see our cookie notice.
            For more detail, see this policy and your browser settings.
          </p>

          <h2 className="legal-prose__h2">Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at
            the top will change when we do; continued use of the site after changes means you accept
            the updated policy where required by law.
          </p>

          <p className="legal-prose__back">
            <Link to="/">← Back to the form</Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
