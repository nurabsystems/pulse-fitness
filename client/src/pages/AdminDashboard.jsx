// client/src/pages/AdminDashboard.jsx
// The admin dashboard — only accessible to users with role 'admin'.
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "../lib/auth-client";

const API_URL =
  import.meta.env.VITE_API_URL || "https://pulse-fitness-y1fa.onrender.com/api";

export function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [actionLoading, setActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  // Redirect non-admin users
  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate("/login?redirect=/admin");
    }
  }, [session, isPending, navigate]);

  // Fetch stats + users
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { credentials: "include" }),
          fetch(`${API_URL}/admin/users`, { credentials: "include" }),
        ]);

        if (statsRes.status === 403 || usersRes.status === 403) {
          setError("You do not have admin access.");
          return;
        }

        const statsData = await statsRes.json();
        const usersData = await usersRes.json();

        setStats(statsData.stats);
        setUsers(usersData.users || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) loadData();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-emerald-400 hover:underline"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  async function updateUserRole(userId, newRole) {
    if (!confirm(`Change this user's role to ${newRole}?`)) return;
    setActionLoading(userId);
    setActionMessage("");
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const err = await res.json();
        setActionMessage(`❌ ${err.error}`);
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      setActionMessage(`✅ Role updated to ${newRole}`);
    } catch {
      setActionMessage("❌ Failed to update role");
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleBan(userId, currentlyBanned) {
    const reason = currentlyBanned ? null : prompt("Reason for ban:");
    if (!currentlyBanned && reason === null) return;

    setActionLoading(userId);
    setActionMessage("");
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ banned: !currentlyBanned, reason }),
      });
      if (!res.ok) {
        const err = await res.json();
        setActionMessage(`❌ ${err.error}`);
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, banned: !currentlyBanned, banReason: reason }
            : u,
        ),
      );
      setActionMessage(currentlyBanned ? "✅ User unbanned" : "✅ User banned");
    } catch {
      setActionMessage("❌ Failed to update ban status");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(userId, email) {
    if (!confirm(`Permanently delete ${email}? This cannot be undone.`)) return;
    setActionLoading(userId);
    setActionMessage("");
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        setActionMessage(`❌ ${err.error}`);
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setActionMessage(`✅ Deleted ${email}`);
    } catch {
      setActionMessage("❌ Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage your Pulse Fitness platform.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold hover:bg-zinc-700"
          >
            ← Back to site
          </Link>
        </header>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <nav className="space-y-1">
              {[
                { id: "overview", label: "Overview" },
                { id: "users", label: "Users" },
                { id: "trainers", label: "Trainers" },
                { id: "classes", label: "Classes" },
                { id: "orders", label: "Orders" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-emerald-400 text-black"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Users"
                    value={stats?.totalUsers}
                    color="emerald"
                  />
                  <StatCard
                    label="Members"
                    value={stats?.totalMembers}
                    color="sky"
                  />
                  <StatCard
                    label="Orders"
                    value={stats?.totalOrders}
                    color="amber"
                  />
                  <StatCard
                    label="Revenue"
                    value={`€${stats?.totalRevenue || 0}`}
                    color="emerald"
                  />
                </div>

                {/* Recent activity placeholder */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <h3 className="text-lg font-bold">Welcome back, Admin</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Use the sidebar to manage users, trainers, classes, and
                    orders.
                  </p>
                </div>
              </>
            )}
            {activeTab === "users" && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-lg font-bold">
                  All Users ({users.length})
                </h3>

                {actionMessage && (
                  <div className="mt-3 rounded-lg bg-zinc-800 p-2 text-sm text-zinc-300">
                    {actionMessage}
                  </div>
                )}

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b border-zinc-800 last:border-0"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  u.image ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=10b981&color=fff&size=32`
                                }
                                alt={u.name}
                                className="h-8 w-8 rounded-full"
                              />
                              <span className="font-semibold">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-zinc-400">{u.email}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                                u.role === "admin"
                                  ? "bg-emerald-400/10 text-emerald-400"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                                u.banned
                                  ? "bg-red-400/10 text-red-400"
                                  : "bg-emerald-400/10 text-emerald-400"
                              }`}
                            >
                              {u.banned ? "Banned" : "Active"}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-1 text-xs">
                              {u.role === "member" ? (
                                <button
                                  onClick={() => updateUserRole(u.id, "admin")}
                                  disabled={actionLoading === u.id}
                                  className="rounded bg-emerald-400/10 px-2 py-1 text-emerald-400 hover:bg-emerald-400/20 disabled:opacity-50"
                                  title="Promote to admin"
                                >
                                  ⬆ Promote
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateUserRole(u.id, "member")}
                                  disabled={actionLoading === u.id}
                                  className="rounded bg-amber-400/10 px-2 py-1 text-amber-400 hover:bg-amber-400/20 disabled:opacity-50"
                                  title="Demote to member"
                                >
                                  ⬇ Demote
                                </button>
                              )}
                              <button
                                onClick={() => toggleBan(u.id, u.banned)}
                                disabled={actionLoading === u.id}
                                className={`rounded px-2 py-1 ${
                                  u.banned
                                    ? "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                                    : "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                                } disabled:opacity-50`}
                                title={u.banned ? "Unban user" : "Ban user"}
                              >
                                {u.banned ? "✓ Unban" : "⊘ Ban"}
                              </button>
                              <button
                                onClick={() => deleteUser(u.id, u.email)}
                                disabled={actionLoading === u.id}
                                className="rounded bg-red-500/10 px-2 py-1 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                                title="Delete user"
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(activeTab === "trainers" ||
              activeTab === "classes" ||
              activeTab === "orders") && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
                <p className="text-zinc-400">
                  Coming in Sprint 2.5.3 / 2.5.4 / 2.5.5.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    emerald: "text-emerald-400",
    sky: "text-sky-400",
    amber: "text-amber-400",
  };
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold ${colorMap[color] || "text-white"}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}
