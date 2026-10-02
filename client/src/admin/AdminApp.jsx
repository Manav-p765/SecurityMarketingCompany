import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { api, setUnauthorizedHandler } from './api.js';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PostsPage from './pages/PostsPage.jsx';
import PostEditorPage from './pages/PostEditorPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import './admin.css';

/**
 * The admin panel at /admin: a lazy-loaded part of the React app (its own
 * JS/CSS chunk), so the public site's bundle is unaffected. Every action is
 * checked again on the server; the role checks here only shape the UI.
 */
const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

/** Meta for every admin screen: never indexed, plain title. */
function useAdminMeta() {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute('content');
    robots?.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (robots && previous) robots.setAttribute('content', previous);
    };
  }, []);
}

/**
 * Unsaved-changes guard for in-app navigation. The editor marks the form
 * dirty; nav links and sign-out then ask before leaving. (Closing or
 * reloading the tab is handled by the editor's beforeunload listener.)
 */
function useDirtyGuard() {
  const dirtyRef = useRef(false);
  const setDirty = useCallback((value) => {
    dirtyRef.current = value;
  }, []);
  const confirmLeave = useCallback(
    () => !dirtyRef.current || window.confirm('You have unsaved changes. Leave without saving?'),
    []
  );
  return useMemo(() => ({ setDirty, confirmLeave, dirtyRef }), [setDirty, confirmLeave]);
}

function NavItem({ to, children, end = false }) {
  const { confirmLeave } = useAdmin();
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}
      onClick={(event) => {
        if (!confirmLeave()) event.preventDefault();
      }}
    >
      {children}
    </NavLink>
  );
}

function Shell({ children }) {
  const { user, signOut } = useAdmin();
  const isAdmin = user.role === 'admin';
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin">
          <img src="/logo/logo-lockup-light.png" alt="Security Marketing Company" width="160" height="54" />
          <span>Admin</span>
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          <NavItem to="/admin" end>
            Dashboard
          </NavItem>
          <NavItem to="/admin/posts">Blog posts</NavItem>
          {isAdmin && <NavItem to="/admin/categories">Categories</NavItem>}
          {isAdmin && <NavItem to="/admin/leads">Leads</NavItem>}
          {isAdmin && <NavItem to="/admin/users">Users</NavItem>}
          <NavItem to="/admin/account">My account</NavItem>
        </nav>
        <div className="admin-sidebar__foot">
          <p className="admin-whoami">
            {user.name}
            <small>
              {user.email} · {user.role}
            </small>
          </p>
          <a className="admin-nav__link" href="/" target="_blank" rel="noopener noreferrer">
            View website ↗
          </a>
          <button type="button" className="admin-nav__link admin-nav__button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main" id="main">
        {children}
      </main>
    </div>
  );
}

/** Admin-only screens: editors are sent back to the dashboard. */
function AdminOnly({ children }) {
  const { user } = useAdmin();
  return user.role === 'admin' ? children : <Navigate to="/admin" replace />;
}

export default function AdminApp() {
  useAdminMeta();
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const guard = useDirtyGuard();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Admin | Security Marketing Company';
  }, [location.pathname]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      guard.setDirty(false);
      setUser(null);
    });
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, [guard]);

  const signOut = useCallback(async () => {
    if (!guard.confirmLeave()) return;
    guard.setDirty(false);
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    navigate('/admin', { replace: true });
  }, [guard, navigate]);

  const value = useMemo(() => ({ user, setUser, signOut, ...guard }), [user, signOut, guard]);

  if (user === undefined) {
    return (
      <div className="admin admin-loading" role="status">
        Loading…
      </div>
    );
  }

  return (
    <AdminContext.Provider value={value}>
      <div className="admin">
        {user === null ? (
          <LoginPage onSignedIn={setUser} />
        ) : (
          <Shell>
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="posts" element={<PostsPage />} />
              {/* Same element for both, so saving a new post (which moves it
                  to /admin/posts/:id) keeps the editor and its cursor. */}
              <Route path="posts/new" element={<PostEditorPage />} />
              <Route path="posts/:id" element={<PostEditorPage />} />
              <Route path="categories" element={<AdminOnly><CategoriesPage /></AdminOnly>} />
              <Route path="leads" element={<AdminOnly><LeadsPage /></AdminOnly>} />
              <Route path="users" element={<AdminOnly><UsersPage /></AdminOnly>} />
              <Route path="account" element={<AccountPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Shell>
        )}
      </div>
    </AdminContext.Provider>
  );
}
