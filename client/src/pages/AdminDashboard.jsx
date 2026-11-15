// client/src/pages/AdminDashboard.jsx
// The admin dashboard — only accessible to users with role 'admin'.
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import { TrainerFormModal } from "../components/TrainerFormModal";
import { ClassFormModal } from "../components/ClassFormModal";

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
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(true);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [classesList, setClassesList] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);

  // Auto-dismiss action message after 20 seconds
  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => {
      setActionMessage("");
    }, 20000);
    return () => clearTimeout(timer);
  }, [actionMessage]);

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

  // Fetch trainers

  useEffect(() => {
    async function loadTrainers() {
      try {
        setTrainersLoading(true);
        const res = await fetch(`${API_URL}/trainers`, {
          credentials: "include",
        });
        const data = await res.json();
        setTrainers(data.trainers || []);
      } catch (err) {
        console.error("Failed to load trainers:", err);
      } finally {
        setTrainersLoading(false);
      }
    }

    if (session?.user) loadTrainers();
  }, [session]);

  // Fetch classes
  useEffect(() => {
    async function loadClasses() {
      try {
        setClassesLoading(true);
        const res = await fetch(`${API_URL}/classes`, {
          credentials: "include",
        });
        const data = await res.json();
        setClassesList(data.classes || []);
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setClassesLoading(false);
      }
    }
    if (session?.user) loadClasses();
  }, [session]);

// Fetch orders
useEffect(() => {
  async function loadOrders() {
    try {
      setOrdersLoading(true);
      const res = await fetch(`${API_URL}/admin/orders`, {
        credentials: 'include',
      });
      const data = await res.json();
      setOrdersList(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }
  if (session?.user) loadOrders();
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

  async function handleSaveTrainer(formData) {
    const url = editingTrainer
      ? `${API_URL}/admin/trainers/${editingTrainer.id}`
      : `${API_URL}/admin/trainers`;

    const method = editingTrainer ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save trainer");
    }

    const data = await res.json();

    if (editingTrainer) {
      setTrainers((prev) =>
        prev.map((t) => (t.id === data.trainer.id ? data.trainer : t)),
      );
      setActionMessage("✅ Trainer updated");
    } else {
      setTrainers((prev) => [...prev, data.trainer]);
      setActionMessage("✅ Trainer created");
    }

    setShowTrainerModal(false);
    setEditingTrainer(null);
  }

  async function handleDeleteTrainer(id, name) {
    if (!confirm(`Delete trainer "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/trainers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        setActionMessage(`❌ ${err.error}`);
        return;
      }
      setTrainers((prev) => prev.filter((t) => t.id !== id));
      setActionMessage(`✅ Deleted ${name}`);
    } catch {
      setActionMessage("❌ Failed to delete trainer");
    }
  }

  function handleEditTrainer(trainer) {
    setEditingTrainer(trainer);
    setShowTrainerModal(true);
  }

  function handleAddTrainer() {
    setEditingTrainer(null);
    setShowTrainerModal(true);
  }

  async function handleSaveClass(formData) {
    const url = editingClass
      ? `${API_URL}/admin/classes/${editingClass.id}`
      : `${API_URL}/admin/classes`;

    const method = editingClass ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save class");
    }

    const data = await res.json();

    if (editingClass) {
      setClassesList((prev) =>
        prev.map((c) => (c.id === data.class.id ? data.class : c)),
      );
      setActionMessage("✅ Class updated");
    } else {
      setClassesList((prev) => [...prev, data.class]);
      setActionMessage("✅ Class created");
    }

    setShowClassModal(false);
    setEditingClass(null);
  }

  async function handleDeleteClass(id, name) {
    if (!confirm(`Delete class "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/classes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        setActionMessage(`❌ ${err.error}`);
        return;
      }
      setClassesList((prev) => prev.filter((c) => c.id !== id));
      setActionMessage(`✅ Deleted ${name}`);
    } catch {
      setActionMessage("❌ Failed to delete class");
    }
  }

  function handleEditClass(c) {
    setEditingClass(c);
    setShowClassModal(true);
  }

  function handleAddClass() {
    setEditingClass(null);
    setShowClassModal(true);
  }


async function openOrderDetail(orderId) {
  setOrderDetailLoading(true);
  try {
    const res = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      credentials: 'include',
    });
    const data = await res.json();
    setSelectedOrder(data.order);
  } catch {
    setActionMessage('❌ Failed to load order detail');
  } finally {
    setOrderDetailLoading(false);
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
                  <div
                    className={`mt-3 flex items-center justify-between rounded-lg p-2 text-sm ${
                      actionMessage.startsWith("✅")
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    <span>{actionMessage}</span>
                    <button
                      onClick={() => setActionMessage("")}
                      className="ml-2 opacity-60 hover:opacity-100"
                      aria-label="Dismiss message"
                    >
                      ✕
                    </button>
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

            {activeTab === "trainers" && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    All Trainers ({trainers.length})
                  </h3>
                  <button
                    onClick={handleAddTrainer}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-500"
                  >
                    + Add Trainer
                  </button>
                </div>

                {actionMessage && (
                  <div
                    className={`mt-3 flex items-center justify-between rounded-lg p-2 text-sm ${
                      actionMessage.startsWith("✅")
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    <span>{actionMessage}</span>
                    <button
                      onClick={() => setActionMessage("")}
                      className="ml-2 opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {trainersLoading ? (
                  <p className="mt-6 text-center text-zinc-500">
                    Loading trainers...
                  </p>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {trainers.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden"
                      >
                        <img
                          src={t.image}
                          alt={t.name}
                          className="h-48 w-full object-cover object-top"
                        />
                        <div className="p-4">
                          <h4 className="font-bold text-white">{t.name}</h4>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                            {t.specialty}
                          </p>
                          <p className="mt-2 text-xs text-zinc-400 line-clamp-3">
                            {t.bio}
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs">
                            ⭐ {t.rating}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleEditTrainer(t)}
                              className="flex-1 rounded bg-amber-400/10 px-2 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-400/20"
                            >
                              ✎ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTrainer(t.id, t.name)}
                              className="flex-1 rounded bg-red-500/10 px-2 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "classes" && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    All Classes ({classesList.length})
                  </h3>
                  <button
                    onClick={handleAddClass}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-500"
                  >
                    + Add Class
                  </button>
                </div>

                {actionMessage && (
                  <div
                    className={`mt-3 flex items-center justify-between rounded-lg p-2 text-sm ${
                      actionMessage.startsWith("✅")
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    <span>{actionMessage}</span>
                    <button
                      onClick={() => setActionMessage("")}
                      className="ml-2 opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {classesLoading ? (
                  <p className="mt-6 text-center text-zinc-500">
                    Loading classes...
                  </p>
                ) : (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                          <th className="pb-2">Day</th>
                          <th className="pb-2">Time</th>
                          <th className="pb-2">Class</th>
                          <th className="pb-2">Trainer</th>
                          <th className="pb-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classesList.map((c) => (
                          <tr
                            key={c.id}
                            className="border-b border-zinc-800 last:border-0"
                          >
                            <td className="py-3 text-emerald-400 font-semibold">
                              {c.day}
                            </td>
                            <td className="py-3 text-zinc-400">{c.time}</td>
                            <td className="py-3 font-semibold text-white">
                              {c.name}
                            </td>
                            <td className="py-3 text-zinc-400">{c.trainer}</td>
                            <td className="py-3">
                              <div className="flex gap-1 text-xs">
                                <button
                                  onClick={() => handleEditClass(c)}
                                  className="rounded bg-amber-400/10 px-2 py-1 text-amber-400 hover:bg-amber-400/20"
                                >
                                  ✎ Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteClass(c.id, c.name)
                                  }
                                  className="rounded bg-red-500/10 px-2 py-1 text-red-400 hover:bg-red-500/20"
                                >
                                  🗑 Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

           {activeTab === "orders" && (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
    <h3 className="text-lg font-bold">
      All Orders ({ordersList.length})
    </h3>

    {ordersLoading ? (
      <p className="mt-6 text-center text-zinc-500">Loading orders...</p>
    ) : ordersList.length === 0 ? (
      <p className="mt-6 text-center text-zinc-500">No orders yet.</p>
    ) : (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map((o) => (
              <tr key={o.id} className="border-b border-zinc-800 last:border-0">
                <td className="py-3 font-mono text-xs text-zinc-400">
                  {o.id.slice(0, 8)}...
                </td>
                <td className="py-3 text-zinc-400">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {o.userName || 'Unknown'}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {o.userEmail || '—'}
                    </span>
                  </div>
                </td>
                <td className="py-3 font-semibold text-emerald-400">
                  €{o.total.toFixed(2)}
                </td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                      o.status === 'paid'
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-amber-400/10 text-amber-400'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => openOrderDetail(o.id)}
                    className="rounded bg-sky-400/10 px-2 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-400/20"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
          </div>
        </div>

        {showTrainerModal && (
          <TrainerFormModal
            trainer={editingTrainer}
            onClose={() => {
              setShowTrainerModal(false);
              setEditingTrainer(null);
            }}
            onSave={handleSaveTrainer}
          />
        )}

        {showClassModal && (
          <ClassFormModal
            classData={editingClass}
            onClose={() => {
              setShowClassModal(false);
              setEditingClass(null);
            }}
            onSave={handleSaveClass}
          />
        )}
{(selectedOrder || orderDetailLoading) && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 max-h-[90vh] overflow-y-auto">
      {orderDetailLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-zinc-400">Loading order details...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Order Details</h2>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-zinc-500 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg bg-zinc-950 p-3 text-sm">
              <p className="text-zinc-400">
                Order ID: <span className="font-mono text-white">{selectedOrder.id}</span>
              </p>
              <p className="mt-1 text-zinc-400">
                Date: <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </p>
              <p className="mt-1 text-zinc-400">
                Status:{' '}
                <span className={selectedOrder.status === 'paid' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </p>
            </div>

            <div className="rounded-lg bg-zinc-950 p-3 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Customer</p>
              <p className="text-white font-semibold">{selectedOrder.userName || 'Unknown'}</p>
              <p className="text-zinc-400">{selectedOrder.userEmail || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Line Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-950 p-3 text-sm"
                  >
                    <span className="text-white">{item.name}</span>
                    <span className="text-emerald-400 font-semibold">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-emerald-400/10 border border-emerald-400/20 p-3">
              <span className="text-sm font-bold text-zinc-300">Total</span>
              <span className="text-xl font-bold text-emerald-400">
                €{selectedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}


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
