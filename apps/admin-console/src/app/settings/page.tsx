"use client";

import { useState, useEffect, useCallback } from "react";

interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  role: string;
  full_name: string | null;
  created_at: string;
}

const ROLES = ["super_admin", "fund_manager", "compliance", "read_only"] as const;

export default function SettingsPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newRole, setNewRole] = useState<string>("read_only");

  const fetchAdminUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-users");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch admin users");
      }
      const data = await res.json();
      setAdminUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGeneratedPassword(null);

    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          full_name: newFullName,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin user");

      setGeneratedPassword(data.generated_password);
      setNewEmail("");
      setNewFullName("");
      setNewRole("read_only");
      setShowAddForm(false);
      fetchAdminUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      setEditingId(null);
      fetchAdminUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove admin user ${email}? This cannot be undone.`)) return;
    setError(null);

    try {
      const res = await fetch(`/api/admin-users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      fetchAdminUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Settings</h2>

      {/* Fund Parameters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Fund Parameters (Read-Only)
        </h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Preferred Return</dt>
            <dd className="font-semibold">8.0% p.a.</dd>
          </div>
          <div>
            <dt className="text-gray-500">Management Fee</dt>
            <dd className="font-semibold">1.5% p.a.</dd>
          </div>
          <div>
            <dt className="text-gray-500">Performance Fee</dt>
            <dd className="font-semibold">20% above hurdle</dd>
          </div>
          <div>
            <dt className="text-gray-500">Integration Fee</dt>
            <dd className="font-semibold">12% of GDV</dd>
          </div>
          <div>
            <dt className="text-gray-500">Min Investment</dt>
            <dd className="font-semibold">$10,000 USDC</dd>
          </div>
        </dl>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-lg mb-4 text-sm">
          <p className="font-semibold mb-1">New Admin Created Successfully</p>
          <p>
            Temporary password:{" "}
            <code className="bg-amber-100 px-2 py-0.5 rounded font-mono text-sm">
              {generatedPassword}
            </code>
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Copy this password now. It will not be shown again.
          </p>
          <button
            onClick={() => setGeneratedPassword(null)}
            className="mt-2 text-xs text-amber-600 hover:text-amber-800 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Admin Users */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Admin Users</h3>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setGeneratedPassword(null);
            }}
            className="px-3 py-1.5 bg-navy text-white text-xs rounded-lg hover:bg-navy/90 transition-colors"
          >
            {showAddForm ? "Cancel" : "Add Admin"}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="px-6 py-4 border-b bg-gray-50">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="admin@f2k.com.au"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-f2k-gold text-navy text-sm font-semibold rounded-lg hover:bg-f2k-gold/90 transition-colors"
            >
              Create Admin User
            </button>
          </form>
        )}

        {/* Table */}
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            Loading admin users...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Added</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.length > 0 ? (
                adminUsers.map((admin) => (
                  <tr key={admin.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{admin.full_name || "---"}</td>
                    <td className="px-4 py-3">{admin.email}</td>
                    <td className="px-4 py-3">
                      {editingId === admin.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-navy/20"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateRole(admin.id, editRole)}
                            className="text-xs text-green-600 hover:text-green-800 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                          {admin.role.replace(/_/g, " ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {editingId !== admin.id && (
                          <button
                            onClick={() => {
                              setEditingId(admin.id);
                              setEditRole(admin.role);
                            }}
                            className="text-xs text-navy hover:text-navy/70 font-medium"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(admin.id, admin.email)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No admin users configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
