import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@fullcalendar/daygrid/index.cjs";
import { ko } from "date-fns/locale";

const MainForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      title: "Scelerisque mauris",
      start: "2025-05-05",
      color: "#f8a5c2", // 분홍
    },
    {
      title: "Convallis egestas in aliquet",
      start: "2025-05-05",
      end: "2025-05-08",
      color: "#b2bec3", // 회색
    },
    {
      title: "Fringilla arcu donec",
      start: "2025-05-15",
      color: "#ff7675", // 빨강
    },
    {
      title: "Turpis venenatis bibendum",
      start: "2025-05-18",
      color: "#2d3436", // 블랙
    },
    {
      title: "Nibh",
      start: "2025-05-23",
      color: "#81ecec", // 민트
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 text-xl font-bold text-primary-300">CORALTASK</div>
        <nav className="flex-1 px-4">
          <ul className="space-y-3 text-gray-700">
            <li className="cursor-pointer hover:text-primary-400">Messenger</li>
            <li className="cursor-pointer text-primary-400 font-semibold">Calendar</li>
            <li className="cursor-pointer hover:text-primary-400">To Do</li>
            <li className="cursor-pointer hover:text-primary-400">Brainstorming</li>
            <li className="cursor-pointer hover:text-primary-400">Memo</li>
            <li className="cursor-pointer hover:text-primary-400">Setting</li>
          </ul>
        </nav>
        <div className="p-4 text-red-500 text-sm cursor-pointer">로그아웃</div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8 bg-white overflow-y-auto">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">캘린더</h2>
          <button className="bg-primary-300 text-white px-5 py-2 rounded-lg hover:bg-primary-400 shadow">
            일정 추가하기
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* 작은 달력 */}
          <div className="col-span-1 bg-white p-4 rounded-xl border shadow-sm">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              weekStartsOn={0}
              locale={ko}
              styles={{
                caption: { color: "#00bfa5", fontWeight: "bold" },
                day_selected: {
                  backgroundColor: "#00bfa5",
                  color: "white",
                  borderRadius: "50%",
                },
                day_today: {
                  border: "2px solid #00bfa5",
                  borderRadius: "50%",
                },
              }}
            />
          </div>

          {/* 큰 캘린더 */}
          <div className="col-span-3 bg-white rounded-xl shadow p-4">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="ko"
              height="auto"
              events={events}
              selectable
              editable
              eventDisplay="block"
              eventTextColor="#fff"
              eventDidMount={(info) => {
                info.el.style.borderRadius = "6px";
                info.el.style.fontSize = "14px";
                info.el.style.padding = "2px 6px";
              }}
              dateClick={(info) => setSelectedDate(new Date(info.dateStr))}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "",
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainForm;
