import { useCallback, useEffect, useState } from 'react';
import { api, formatDateTime } from '../api.js';
import { ConfirmButton, Field, Notice, PageHead } from '../components.jsx';
import { useAdmin } from '../AdminApp.jsx';

const NEW_USER = { name: '', email: '', role: 'editor', password: '' };

function ResetPassword({ user, onDone }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (!open) {
    return (
      <button type="button" className="admin-btn admin-btn--small" onClick={() => setOpen(true)}>
        Reset password
      </button>
    );
  }
  return (
    <form
      className="admin-inline-form"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await api(`/users/${user.id}/reset-password`, { method: 'POST', body: { password } });
          setOpen(false);
          setPassword('');
          onDone(`New password set for ${user.name}. Give it to them securely; they are signed out everywhere.`);
        } catch (err) {
          setError(err.errors?.password || err.message);
        }
      }}
    >
      <input
        type="password"
        autoComplete="new-password"
        aria-label={`New password for ${user.name}`}
        placeholder="New password (10+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="admin-btn admin-btn--small admin-btn--primary">
        Set
      </button>
      <button type="button" className="admin-btn admin-btn--small admin-btn--ghost" onClick={() => setOpen(false)}>
        Cancel
      </button>
      {error && <span className="admin-error">{error}</span>}
    </form>
  );
}

export default function UsersPage() {
  const { user: me } = useAdmin();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(NEW_USER);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ kind: 'info', text: '' });

  const load = useCallback(() => {
    api('/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setNotice({ kind: 'error', text: err.message }));
  }, []);
  useEffect(load, [load]);

  const add = async (event) => {
    event.preventDefault();
    try {
      await api('/users', { method: 'POST', body: form });
      setNotice({ kind: 'success', text: `Added ${form.name}. Share their email and password with them securely.` });
      setForm(NEW_USER);
      setErrors({});
      load();
    } catch (err) {
      setErrors(err.errors || {});
      setNotice({ kind: 'error', text: err.message });
    }
  };

  const remove = async (user) => {
    try {
      await api(`/users/${user.id}`, { method: 'DELETE' });
      setNotice({ kind: 'success', text: `Removed ${user.name}.` });
      load();
    } catch (err) {
      setNotice({ kind: 'error', text: err.message });
    }
  };

  return (
    <>
      <PageHead title="Users" />
      <Notice kind={notice.kind} onClose={() => setNotice({ kind: 'info', text: '' })}>
        {notice.text}
      </Notice>

      <div className="admin-card admin-card--flush">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last sign-in</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.name}
                  {user.id === me.id && <small className="admin-muted"> (you)</small>}
                </td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? 'Admin' : 'Editor'}</td>
                <td>{formatDateTime(user.lastLoginAt)}</td>
                <td className="admin-table__actions">
                  {user.id !== me.id && (
                    <>
                      <ResetPassword user={user} onDone={(text) => setNotice({ kind: 'success', text })} />
                      <ConfirmButton
                        className="admin-btn admin-btn--small admin-btn--danger"
                        message={`Remove ${user.name} (${user.email})? They will no longer be able to sign in.`}
                        onConfirm={() => remove(user)}
                      >
                        Remove
                      </ConfirmButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="admin-card admin-form-grid" onSubmit={add} noValidate>
        <h2>Add a user</h2>
        <Field label="Name" htmlFor="user-name" error={errors.name}>
          <input id="user-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email" htmlFor="user-email" error={errors.email}>
          <input id="user-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field
          label="Role"
          htmlFor="user-role"
          hint="Editors can write and publish blog posts. Admins can also manage categories, users and leads."
        >
          <select id="user-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Field label="Password" htmlFor="user-password" error={errors.password} hint="At least 10 characters. They can change it under My account.">
          <input
            id="user-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <div>
          <button type="submit" className="admin-btn admin-btn--primary">
            Add user
          </button>
        </div>
      </form>
    </>
  );
}
