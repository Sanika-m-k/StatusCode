import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { Dashboard } from './pages/dashboard';
import { EmailVerification } from './pages/emailVerification';
import { AuthGuard } from './components/authGuard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route 
        path="/dashboard" 
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } 
      />
    </Routes>
  );
}