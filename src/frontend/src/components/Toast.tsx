import { useEffect } from "react";
import { useGamificationStore } from "../store/userGamificationStore";

const typeStyles: Record<string, string> = {
  xp: "bg-gradient-to-r from-green-600 to-green-700 border-green-400",
  levelup: "bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-400",
  combo: "bg-gradient-to-r from-orange-600 to-red-600 border-orange-400",
  racha: "bg-gradient-to-r from-orange-500 to-red-500 border-orange-300",
  puntos: "bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-300",
  info: "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400",
};

const typeIcons: Record<string, string> = {
  xp: "⚡",
  levelup: "⬆",
  combo: "🔥",
  racha: "📅",
  puntos: "💎",
  info: "ℹ",
};

export const Toast = () => {
  const notifications = useGamificationStore((state) => state.notifications);
  const removeNotification = useGamificationStore((state) => state.removeNotification);

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {notifications.map((notif) => (
        <ToastItem
          key={notif.id}
          notif={notif}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </div>
  );
};

const ToastItem = ({
  notif,
  onClose,
}: {
  notif: { id: string; type: string; message: string; value?: string | number };
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${typeStyles[notif.type] || typeStyles.info} border rounded-lg px-4 py-3 text-white shadow-xl animate-slide-in flex items-center gap-3`}
    >
      <span className="text-xl">{typeIcons[notif.type] || "ℹ"}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{notif.message}</p>
        {notif.value && <p className="text-xs opacity-80">{notif.value}</p>}
      </div>
      <button onClick={onClose} className="text-white/60 hover:text-white text-lg">
        ✕
      </button>
    </div>
  );
};
