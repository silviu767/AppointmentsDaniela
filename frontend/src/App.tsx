import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { HomePage } from './pages/HomePage'
import { BookingPage } from './pages/BookingPage'
import { AuthPage } from './pages/AuthPage'
import { ClientDashboardPage } from './pages/ClientDashboardPage'
import { AdminPage } from './pages/AdminPage'
import { PrivacyPage } from './pages/PrivacyPage'

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programare" element={<BookingPage />} />
            <Route path="/autentificare" element={<AuthPage />} />
            <Route path="/contul-meu" element={<ClientDashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
