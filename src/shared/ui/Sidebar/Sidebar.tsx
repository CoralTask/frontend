// Sidebar.tsx
import { useState, type JSX } from "react";
import {
  FiMessageSquare,
  FiCalendar,
  FiCheckSquare,
  FiZap,
  FiFileText,
  FiSettings,
  FiChevronRight,
  FiBell,
} from "react-icons/fi";

type NavKey =
  | "Messenger"
  | "Calendar"
  | "To Do"
  | "Brainstorming"
  | "Memo"
  | "Setting";

const NAVS: { key: NavKey; label: string; icon: JSX.Element }[] = [
  { key: "Messenger", label: "Messenger", icon: <FiMessageSquare /> },
  { key: "Calendar", label: "Calendar", icon: <FiCalendar /> },
  { key: "To Do", label: "To Do", icon: <FiCheckSquare /> },
  { key: "Brainstorming", label: "Brainstorming", icon: <FiZap /> },
  { key: "Memo", label: "Memo", icon: <FiFileText /> },
  { key: "Setting", label: "Setting", icon: <FiSettings /> },
];

const DUMMY_NOTIS = new Array(6).fill(0).map((_, i) => ({
  id: i + 1,
  name: "닉네임입니다",
  text: "Ullamcorper condimentum tincidunt…",
  avatar:
    "https://api.dicebear.com/8.x/thumbs/svg?seed=" + (i + 31).toString(),
}));

export default function Sidebar({
  active = "Calendar",
  onChange, 
}: {
  active?: NavKey;
  onChange?: (k: NavKey) => void;
}) {
  const [current, setCurrent] = useState<NavKey>(active);

  const handleClick = (k: NavKey) => {
    setCurrent(k);
    onChange?.(k);
  };

  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      {/* 프로필 영역 */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <img
          src="https://api.dicebear.com/8.x/thumbs/svg?seed=do-hyun"
          alt="avatar"
          className="w-9 h-9 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">닉네임</span>
          <span className="text-gray-800 font-semibold">식별입니다</span>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="px-2 py-3">
        {NAVS.map(({ key, label, icon }) => {
          const isActive = current === key;
          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={[
                "w-full flex items-center justify-between rounded-lg px-3 py-2 mb-1",
                "transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-500"
                  : "hover:bg-gray-50 text-gray-700",
              ].join(" ")}
            >
              <span className="flex items-center gap-3">
                <span
                  className={[
                    "text-lg",
                    isActive ? "text-primary-400" : "text-gray-500",
                  ].join(" ")}
                >
                  {icon}
                </span>
                <span className="text-sm font-medium">{label}</span>
              </span>
              <FiChevronRight
                className={isActive ? "text-primary-400" : "text-gray-300"}
              />
            </button>
          );
        })}
      </nav>

      {/* Notification 리스트 */}
      <div className="mt-1 border-t">
        <div className="flex items-center gap-2 px-4 py-3">
          <FiBell className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            Notification
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {DUMMY_NOTIS.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <img src={n.avatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="min-w-0">
                <div className="text-xs text-gray-800 font-semibold">
                  {n.name}
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  {n.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mt-auto px-4 py-4">
        <button className="text-[13px] text-red-500 hover:underline">
          로그아웃하기
        </button>
      </div>
    </aside>
  );
}
