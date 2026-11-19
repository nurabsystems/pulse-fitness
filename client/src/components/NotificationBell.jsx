import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`${API_URL}/notifications`, { credentials: 'include' });
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotifications();
    // Optional: Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    // Optimistic UI update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-zinc-400 hover:text-white transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
            <h3 className="font-bold text-white text-sm">Notifications</h3>
            <span className="text-xs text-zinc-500">{unreadCount} unread</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-zinc-500">No notifications yet.</p>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                  className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/50 transition ${!n.read ? 'bg-emerald-500/5' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm ${!n.read ? 'font-bold text-white' : 'text-zinc-400'}`}>{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-2">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}