import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FormPage from './FormPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import { CookieBanner } from './components/CookieBanner'
import { ScrollToTop } from './components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
