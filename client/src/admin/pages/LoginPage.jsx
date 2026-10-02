import { useState } from 'react';
import { api } from '../api.js';

export default function LoginPage({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { user } = await api('/auth/login', { method: 'POST', body: { email, password } });
      setPassword('');
      onSignedIn(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-card admin-login__card" onSubmit={submit} noValidate>
        <img src="/logo/logo-lockup-light.png" alt="Security Marketing Company" width="200" height="67" />
        <h1>Sign in</h1>
        {error && (
          <p className="admin-notice admin-notice--error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn--primary admin-btn--block" disabled={busy || !email || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="admin-hint">Forgot your password? Ask an admin to reset it.</p>
      </form>
    </div>
  );
}
