import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Wrong from './pages/Wrong'
import MockSelect from './pages/MockSelect'
import Settings from './pages/Settings'
import { isLoggedIn } from './lib/storage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: loc }} />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/quiz/:bookId/:mode/:scope" element={<RequireAuth><Quiz /></RequireAuth>} />
      <Route path="/result/:bookId" element={<RequireAuth><Result /></RequireAuth>} />
      <Route path="/wrong/:bookId" element={<RequireAuth><Wrong /></RequireAuth>} />
      <Route path="/mock/:bookId/select" element={<RequireAuth><MockSelect /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
