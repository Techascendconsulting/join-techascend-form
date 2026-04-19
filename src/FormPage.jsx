import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { SuccessScreen } from './components/SuccessScreen'
import { SiteFooter } from './components/SiteFooter'
import './App.css'

function IconTrainingYes() {
  return (
    <svg className="choice__glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function IconTrainingProvider() {
  return (
    <svg className="choice__glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  )
}

function IconNewToThis() {
  return (
    <svg className="choice__glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  )
}

function CheckMark() {
  return (
    <svg className="choice__tick" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 6L9 17l-5-5"
      />
    </svg>
  )
}

function formatInsertError(err) {
  if (!err) {
    return 'Could not save your details. Please try again.'
  }
  const parts = [err.message, err.details, err.hint]
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
  if (parts.length) {
    return parts.join(' · ')
  }
  return 'Could not save your details. Please try again.'
}

const initialForm = {
  name: '',
  email: '',
  whatsapp: '',
  currentJob: '',
  trainingPath: '',
  struggles: '',
  ukBased: '',
  instagramFollow: '',
  referralCode: '',
}

export default function FormPage() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [applicationConsent, setApplicationConsent] = useState(false)

  useEffect(() => {
    document.title = submitted
      ? 'Thanks — Tech Ascend Consulting'
      : 'Tech Ascend Consulting — Free BA experience'
  }, [submitted])

  const update = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitted) setSubmitted(false)
    if (formError) setFormError(null)
  }

  const updatePhone = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '')
    setForm((prev) => ({ ...prev, whatsapp: digitsOnly }))
    if (submitted) setSubmitted(false)
    if (formError) setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const hasTrainingExperience =
      form.trainingPath === 'self_study' ||
      form.trainingPath === 'provider_hands_on'

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.whatsapp.trim()
    const currentJob = form.currentJob.trim()
    const struggles = hasTrainingExperience
      ? form.struggles.trim() || null
      : null
    const hasTrainedBefore =
      form.trainingPath === 'self_study' ||
      form.trainingPath === 'provider_hands_on'
    const isUk = form.ukBased === 'yes'
    const referralCode = form.referralCode.trim() || null
    const instagramFollowing = form.instagramFollow

    if (
      !name ||
      !email ||
      !phone ||
      !currentJob ||
      !form.trainingPath ||
      !form.ukBased ||
      !form.instagramFollow
    ) {
      setFormError('Please complete all required fields.')
      return
    }

    if (hasTrainingExperience && !form.struggles.trim()) {
      setFormError('Please describe the struggles you have faced.')
      return
    }

    if (!applicationConsent) {
      setFormError(
        'Please confirm below that you agree to be contacted and that your information is accurate.',
      )
      return
    }

    setSubmitting(true)

    if (!supabase) {
      setSubmitting(false)
      setFormError(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart the dev server.',
      )
      return
    }

    const { error: saveError } = await supabase.rpc('upsert_application', {
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_current_job: currentJob,
      p_has_trained_before: hasTrainedBefore,
      p_struggles: struggles,
      p_is_uk: isUk,
      p_referral_code: referralCode,
      p_instagram_following: instagramFollowing,
      p_status: 'pending',
    })

    if (saveError) {
      console.error('Supabase upsert_application:', saveError)
      setSubmitting(false)
      setFormError(formatInsertError(saveError))
      return
    }

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
    } catch (err) {
      console.error('send-email:', err)
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  const showStruggles =
    form.trainingPath === 'self_study' ||
    form.trainingPath === 'provider_hands_on'

  if (submitted) {
    return (
      <div className="page page--success">
        <div className="page--success__main">
          <SuccessScreen />
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Tech Ascend Consulting</p>
        <h1 className="page__title">Start your free 2-week Business Analyst experience</h1>
        <p className="page__lede">
          Tell us a bit about yourself. It only takes a minute. We&apos;ll review your response and
          follow up via WhatsApp.
        </p>
      </header>

      <main className="card">
        <form className="form" onSubmit={handleSubmit}>
          {formError && (
            <div className="form__error" role="alert">
              {formError}
            </div>
          )}
          <div className="field">
            <label className="label label--required" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
              required
              placeholder="Jane Smith"
            />
          </div>

          <div className="field">
            <label className="label label--required" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={update('email')}
              required
              placeholder="you@company.com"
            />
          </div>

          <div className="field">
            <label className="label label--required" htmlFor="whatsapp">
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              className="input"
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]+"
              title="Digits only (no spaces or symbols)"
              value={form.whatsapp}
              onChange={updatePhone}
              required
              placeholder="4471234567890"
              aria-describedby="whatsapp-hint"
            />
            <p className="field__hint" id="whatsapp-hint">
              Digits only — country code and number, no spaces.
            </p>
          </div>

          <div className="field">
            <label className="label label--required" htmlFor="currentJob">
              Current job
            </label>
            <input
              id="currentJob"
              name="currentJob"
              type="text"
              className="input"
              value={form.currentJob}
              onChange={update('currentJob')}
              required
              placeholder="Role or focus area"
            />
          </div>

          <fieldset className="fieldset">
            <legend className="label fieldset__legend label--required">
              Have you trained before?
            </legend>
            <p className="fieldset__help">
              Helps us tailor the free 2-week experience — pick what fits you best.
            </p>
            <div
              className="choice-grid choice-grid--training"
              role="group"
              aria-label="How you trained"
            >
              <label className="choice">
                <input
                  type="radio"
                  name="trainingPath"
                  className="choice__input"
                  value="self_study"
                  checked={form.trainingPath === 'self_study'}
                  onChange={update('trainingPath')}
                  required
                />
                <span className="choice__card">
                  <span className="choice__icon choice__icon--training-yes">
                    <IconTrainingYes />
                  </span>
                  <span className="choice__copy">
                    <span className="choice__title">On my own</span>
                    <span className="choice__hint">
                      I did it by reading and studying — self-directed learning
                    </span>
                  </span>
                  <span className="choice__marker">
                    <CheckMark />
                  </span>
                </span>
              </label>
              <label className="choice">
                <input
                  type="radio"
                  name="trainingPath"
                  className="choice__input"
                  value="provider_hands_on"
                  checked={form.trainingPath === 'provider_hands_on'}
                  onChange={update('trainingPath')}
                />
                <span className="choice__card">
                  <span className="choice__icon choice__icon--training-no">
                    <IconTrainingProvider />
                  </span>
                  <span className="choice__copy">
                    <span className="choice__title">Training provider</span>
                    <span className="choice__hint">
                      With a provider — including hands-on projects
                    </span>
                  </span>
                  <span className="choice__marker">
                    <CheckMark />
                  </span>
                </span>
              </label>
              <label className="choice">
                <input
                  type="radio"
                  name="trainingPath"
                  className="choice__input"
                  value="new_to_this"
                  checked={form.trainingPath === 'new_to_this'}
                  onChange={update('trainingPath')}
                />
                <span className="choice__card">
                  <span className="choice__icon choice__icon--training-new">
                    <IconNewToThis />
                  </span>
                  <span className="choice__copy">
                    <span className="choice__title">No — I’m new to this</span>
                    <span className="choice__hint">
                      I haven’t trained yet; I’m just getting started
                    </span>
                  </span>
                  <span className="choice__marker">
                    <CheckMark />
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div
            className={`field field--conditional ${showStruggles ? 'field--visible' : ''}`}
            aria-hidden={!showStruggles}
          >
            <label
              className={showStruggles ? 'label label--required' : 'label'}
              htmlFor="struggles"
            >
              What struggles have you faced?
            </label>
            <textarea
              id="struggles"
              name="struggles"
              className="input input--textarea"
              rows={4}
              value={form.struggles}
              onChange={update('struggles')}
              placeholder="Briefly describe what’s been hard — we read every answer."
              required={showStruggles}
            />
          </div>

          <div className="field">
            <label className="label label--required" htmlFor="ukBased">
              Are you based in the UK?
            </label>
            <select
              id="ukBased"
              name="ukBased"
              className="input input--select"
              value={form.ukBased}
              onChange={update('ukBased')}
              required
            >
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="field">
            <label
              className="label label--multiline label--required"
              htmlFor="instagramFollow"
            >
              <span>Are you currently following us on Instagram?</span>
              <span className="label__parenthetical">
                (We recommend following us for updates about the free 2-week experience.)
              </span>
            </label>
            <select
              id="instagramFollow"
              name="instagramFollow"
              className="input input--select"
              value={form.instagramFollow}
              onChange={update('instagramFollow')}
              required
            >
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="field">
            <label className="label label--optional" htmlFor="referralCode">
              Referral code
              <span className="optional-tag">Optional</span>
            </label>
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              className="input"
              value={form.referralCode}
              onChange={update('referralCode')}
              placeholder="If someone referred you"
            />
          </div>

          <div className="field field--consent">
            <label className="consent-label" htmlFor="applicationConsent">
              <input
                id="applicationConsent"
                name="applicationConsent"
                type="checkbox"
                className="consent-label__input"
                checked={applicationConsent}
                onChange={(e) => {
                  setApplicationConsent(e.target.checked)
                  if (formError) setFormError(null)
                }}
                required
              />
              <span className="consent-label__text">
                I agree to be contacted about my application and related programme information, and I
                confirm that the information I provide is accurate.
              </span>
            </label>
          </div>

          <button type="submit" className="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send my details'}
          </button>
        </form>
      </main>

      <SiteFooter />
    </div>
  )
}
