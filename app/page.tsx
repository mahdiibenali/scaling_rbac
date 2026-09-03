'use client';

import { useState } from 'react';
import { UserAccount, authenticate } from './lib/auth/users';
import { Permission } from './lib/rbac/permission';
import { hasPermission } from './lib/rbac/roles';
import { NAVIGATION_CONFIG, getFilteredNavigation } from './lib/navigation/navigation-config';

export default function Home() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = authenticate(email, password);
    if (account) {
      setUser(account);
      setMessage('');
    } else {
      setMessage('Invalid credentials');
    }
  };

  // 1. Login View
  if (!user) {
    return (
      <main className="p-10 max-w-sm mx-auto space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <form onSubmit={onLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email (admin@rbac.com / user@rbac.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded text-sm text-black"
            required
          />
          <input
            type="password"
            placeholder="Password (admin123 / user123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded text-sm text-black"
            required
          />
          <button type="submit" className="w-full bg-black text-white p-2 rounded text-sm">
            Sign In
          </button>
        </form>
      </main>
    );
  }

  // 2. Logged In Dashboard
  const myNav = getFilteredNavigation(NAVIGATION_CONFIG, user.role);

  return (
    <main className="p-10 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {user.name} | Role: <span className="font-bold uppercase">{user.role}</span>
          </p>
        </div>
        <button
          onClick={() => setUser(null)}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-black px-3 py-1.5 rounded"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="p-3 bg-gray-100 rounded text-sm font-mono text-black">
          {message}
        </div>
      )}

      {/* Navigation allowed for this role */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="font-semibold text-sm">Allowed Navigation Routes:</h2>
        <ul className="space-y-2">
          {myNav.map((group) => (
            <li key={group.id} className="text-sm">
              <span className="font-bold text-gray-700">{group.label}:</span>{' '}
              {group.children?.map((c) => c.label).join(', ')}
            </li>
          ))}
        </ul>
      </div>


      <div className="border p-4 rounded space-y-3">
        <h2 className="font-semibold text-sm">Test Action Permissions:</h2>
        <div className="flex flex-wrap gap-2">
          {[
            Permission.CREATE_AGENT,
            Permission.DELETE_AGENT,
            Permission.CREATE_BATTLE,
            Permission.DELETE_BATTLE,
          ].map((perm) => (
            <button
              key={perm}
              onClick={() => {
                const allowed = hasPermission(user.role, perm);
                setMessage(allowed ? `ALLOWED: ${perm}` : `FORBIDDEN: ${perm}`);
              }}
              className="border px-3 py-1 text-xs rounded hover:bg-gray-100"
            >
              {perm}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
