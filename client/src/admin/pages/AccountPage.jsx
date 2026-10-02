import { useState } from 'react';
import { api } from '../api.js';
import { Field, Notice, PageHead } from '../components.jsx';
import { useAdmin } from '../AdminApp.jsx';

const EMPTY = { currentPassword: '', newPassword: '', confirm: '' };

export default function AccountPage() {
  const { user } = useAdmin();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ kind: 'info', text: '' });

  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirm) {
      setErrors({ confirm: 'The new passwords do not match.' });
      return;
    }
    try {
      await api('/auth/change-password', {
        method: 'POST',
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      setForm(EMPTY);
      setErrors({});
      setNotice({ kind: 'success', text: 'Password changed. Other devices have been signed out.' });
    } catch (err) {
      setErrors(err.errors || {});
      setNotice({ kind: 'error', text: err.message });
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <PageHead title="My account" />
      <div className="admin-card">
        <dl className="admin-dl">
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Role</dt>
          <dd>{user.role === 'admin' ? 'Admin' : 'Editor'}</dd>
        </dl>
      </div>
      <Notice kind={notice.kind} onClose={() => setNotice({ kind: 'info', text: '' })}>
        {notice.text}
      </Notice>
      <form className="admin-card admin-form-grid" onSubmit={submit} noValidate>
        <h2>Change password</h2>
        <Field label="Current password" htmlFor="current-password" error={errors.currentPassword}>
          <input id="current-password" type="password" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} />
        </Field>
        <Field label="New password" htmlFor="new-password" error={errors.newPassword} hint="At least 10 characters.">
          <input id="new-password" type="password" autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} />
        </Field>
        <Field label="Repeat new password" htmlFor="confirm-password" error={errors.confirm}>
          <input id="confirm-password" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
        </Field>
        <div>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={!form.currentPassword || !form.newPassword}>
            Change password
          </button>
        </div>
      </form>
    </>
  );
}
