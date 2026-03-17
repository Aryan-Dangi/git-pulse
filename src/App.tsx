import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/ui/Navbar'

const HomePage = lazy(() => import('./pages/Home'))
const ProfilePage = lazy(() => import('./pages/Profile'))
const RepoDetailsPage = lazy(() => import('./pages/RepoDetails'))
const ComparePage = lazy(() => import('./pages/Compare'))

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex gap-1.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce"
          style={{ backgroundColor: 'var(--accent)', animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/repo/:owner/:repo" element={<RepoDetailsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="*" element={
              <div className="page-container text-center py-20">
                <div className="text-6xl mb-4">404</div>
                <h2 className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>
                  Page not found
                </h2>
                <a href="/" className="btn-primary">← Back to Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default App
