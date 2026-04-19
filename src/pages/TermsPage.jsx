import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Terms of Use — Tech Ascend Consulting'
  }, [])

  return (
    <div className="page page--legal">
      <header className="page__header page__header--legal">
        <p className="page__eyebrow">Tech Ascend Consulting</p>
        <h1 className="page__title">Terms of Use</h1>
        <p className="page__lede page__lede--legal">
          Terms for using this site and applying for our free experience. Last updated: April 2026.
        </p>
      </header>

      <main className="card card--legal">
        <div className="legal-prose">
          <p>
            These Terms of Use apply to jointechascend.com and the registration form operated by
            TechAscend Consulting (&quot;we&quot;, &quot;us&quot;). By using the site or submitting
            the form, you agree to these terms together with our{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <h2 className="legal-prose__h2">What this page is for</h2>
          <p>
            This page is for applying for our <strong>free 2-week Business Analyst experience</strong>
            . It is an interest and application process — not an offer of employment, a paid course
            contract, or a guarantee of any particular outcome unless we say so separately in
            writing.
          </p>

          <h2 className="legal-prose__h2">No guarantee of acceptance or outcomes</h2>
          <p>
            Submitting the form <strong>does not guarantee</strong> that you will be accepted,
            that you will retain continued access to any group or materials, or that you will receive
            a job or placement. Places, timing, and eligibility are at our discretion.
          </p>

          <h2 className="legal-prose__h2">Our discretion</h2>
          <p>
            We reserve the right to <strong>accept, decline, remove, or limit access</strong> to any
            applicant, participant, or community channel at any time, for reasons including capacity,
            suitability, safety, or conduct.
          </p>

          <h2 className="legal-prose__h2">Conduct</h2>
          <p>
            Misuse, abuse, harassment, dishonesty, or disruptive behaviour towards our team, other
            participants, or within our channels may result in <strong>removal</strong> from groups,
            sessions, or future opportunities, without liability to us except as required by law.
          </p>

          <h2 className="legal-prose__h2">Intellectual property</h2>
          <p>
            Content, materials, and access provided through the experience (including documents,
            recordings where applicable, and branding) remain our intellectual property
            or that of our licensors. You must not copy, share, distribute, republish, or reuse them
            in whole or in part <strong>without our prior written permission</strong>, except as
            permitted by law for fair personal use.
          </p>

          <h2 className="legal-prose__h2">Accurate information</h2>
          <p>
            You agree to provide <strong>accurate and truthful</strong> information when applying.
            Misleading or fraudulent applications may be rejected or removed.
          </p>

          <h2 className="legal-prose__h2">Changes to the offer</h2>
          <p>
            We may update the <strong>offer, structure, schedule, or access terms</strong> of the free
            experience or related programme at any time. We will try to communicate material changes
            where practical, but continued participation after notice may constitute acceptance of
            updated terms where applicable.
          </p>

          <h2 className="legal-prose__h2">Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a href="mailto:admin@techascendconsulting.com">admin@techascendconsulting.com</a>.
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
