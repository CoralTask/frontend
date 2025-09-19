// MainForm.tsx
import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import type { DatesSetArg, DayCellContentArg } from "@fullcalendar/core";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@fullcalendar/daygrid/index.cjs";
import { ko } from "date-fns/locale";
import { format, isSameDay, parseISO, isWithinInterval } from "date-fns";
import Sidebar from "./Sidebar";

type ViewMode = "month" | "week";

type EventItem = {
  title: string;
  start: string;
  end?: string; // FullCalendar end는 exclusive
  color: string;
};

const MainForm = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentTitle, setCurrentTitle] = useState<string>(
    format(new Date(), "yyyy년 M월", { locale: ko })
  );

  const events: EventItem[] = [
    { title: "Scelerisque mauris", start: "2025-05-05", color: "#5ccac2" },
    { title: "Convallis egestas in aliquet", start: "2025-05-05", end: "2025-05-08", color: "#a9afb7" },
    { title: "Fringilla arcu donec", start: "2025-05-15", color: "#f1726a" },
    { title: "Turpis venenatis bibendum", start: "2025-05-18", color: "#2d3436" },
    { title: "Nibh", start: "2025-05-23", color: "#81ecec" },
  ];

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => {
      const s = parseISO(e.start);
      if (e.end) {
        const endInclusive = new Date(parseISO(e.end));
        endInclusive.setDate(endInclusive.getDate() - 1);
        return isWithinInterval(selectedDate, { start: s, end: endInclusive });
      }
      return isSameDay(s, selectedDate);
    });
  }, [selectedDate, events]);

  const goPrev = () => calendarRef.current?.getApi().prev();
  const goNext = () => calendarRef.current?.getApi().next();

  const changeView = (mode: ViewMode) => {
    setViewMode(mode);
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.changeView(mode === "month" ? "dayGridMonth" : "dayGridWeek");
  };

  const onDatesSet = (_: DatesSetArg) => {
    const date = calendarRef.current?.getApi().getDate() ?? new Date();
    setCurrentTitle(format(date, "yyyy년 M월", { locale: ko }));
  };

const onDateClick = (info: DateClickArg) => {
  setSelectedDate(info.date);
  setMonth(info.date); 
};

  return (
    <div className="flex h-screen bg-white">
      <Sidebar active="Calendar" />

      <main className="flex-1 bg-white overflow-y-auto">
        {/* 페이지 타이틀 + 일정추가 버튼 */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">캘린더</h2>
          <button className="bg-primary-300 text-white px-5 py-2 rounded-lg hover:bg-primary-400 shadow">
            일정 추가하기
          </button>
        </div>

        <div className="px-8 pb-10 grid grid-cols-4 gap-6">
          {/* ───────── 작은 달력 카드 ───────── */}
          <div className="col-span-1 bg-white p-4 rounded-xl border shadow-sm">

            <DayPicker
              mode="single"
              month={month}                 
              onMonthChange={setMonth}      
              selected={selectedDate}
              onSelect={(day) => {
                setSelectedDate(day);
                if (day) {
                  const api = calendarRef.current?.getApi();
                  api?.gotoDate(day);
                  api?.select(day);
                  setMonth(day);
                }
              }}
              weekStartsOn={0}
              locale={ko}
              formatters={{
                formatCaption: (month, options) =>
                  `${month.getFullYear()}년 ${month.getMonth() + 1}월`,
              }}
              styles={{
                day_selected: {
                  outline: "2px solid #00bfa5",
                  color: "#00bfa5",
                  backgroundColor: "transparent",
                  borderRadius: "50%",
                },
                day_today: {
                  border: "2px dashed #00bfa5",
                  borderRadius: "50%",
                },
              }}
            />


            {/* 선택 날짜 일정 목록 */}
            <div className="mt-4">
              <div className="text-sm text-gray-700 font-semibold mb-2">
                {selectedDate ? format(selectedDate, "yyyy.MM.dd (eee)", { locale: ko }) : ""}
              </div>
              {selectedDayEvents.length === 0 ? (
                <div className="text-xs text-gray-400">등록된 일정이 없습니다.</div>
              ) : (
                <ul className="space-y-1">
                  {selectedDayEvents.map((e, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="mt-1 inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: e.color }}
                      />
                      <span className="text-sm text-gray-700">{e.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ───────── 큰 캘린더 카드 ───────── */}
          <div className="col-span-3 bg-white rounded-xl shadow p-4">
            {/* 상단: 중앙 pill 네비 + 우측 원형 월/주 토글 */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-16" />
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  className="w-9 h-9 rounded-xl border text-gray-700 hover:bg-gray-50"
                  aria-label="이전"
                >
                  ‹
                </button>
                <div className="px-5 h-9 rounded-xl border flex items-center font-semibold text-gray-800">
                  {currentTitle.replace(" ", " ")}
                </div>
                <button
                  onClick={goNext}
                  className="w-9 h-9 rounded-xl border text-gray-700 hover:bg-gray-50"
                  aria-label="다음"
                >
                  ›
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeView("month")}
                  className={[
                    "w-9 h-9 rounded-full border text-sm",
                    viewMode === "month"
                      ? "bg-primary-300 text-white border-primary-300"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  월
                </button>
                <button
                  onClick={() => changeView("week")}
                  className={[
                    "w-9 h-9 rounded-full border text-sm",
                    viewMode === "week"
                      ? "bg-primary-300 text-white border-primary-300"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  주
                </button>
              </div>
            </div>

            <div className="relative">
              {/* FullCalendar */}
              <FullCalendar
                ref={calendarRef as any}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                headerToolbar={false}
                height="auto"
                firstDay={0}
                events={events}
                selectable
                editable
                dayMaxEventRows={3}
                datesSet={onDatesSet}
                dateClick={(info: DateClickArg) => onDateClick(info)}
                dayCellContent={(arg: DayCellContentArg) => {
                  const type = calendarRef.current?.getApi().view.type ?? "";
                  const isMonth = type.includes("Month");
                  const n = arg.date.getDate();
                  // 월 뷰: 숫자만 간결하게
                  return { html: `<div class="fc-daygrid-day-number">${isMonth ? `${n}` : `${n}`}</div>` };
                }}
                eventDisplay="block"
                eventTextColor="#fff"
                eventDidMount={(info) => {
                  const el = info.el as HTMLElement;
                  el.style.borderRadius = "8px";
                  el.style.fontSize = "13px";
                  el.style.padding = "4px 8px";
                  el.style.border = "none";
                }}
              />

              {/* FullCalendar 스타일 오버라이드(두 번째 스샷처럼) */}
              <style>{`
                .fc {
                  --fc-event-bg-color: transparent;
                  --fc-today-bg-color: #fff8e1; /* 오늘 연노랑 하이라이트 */
                }
                /* 헤더(요일) */
                .fc .fc-col-header-cell-cushion {
                  color: #9ca3af;          /* gray-400 */
                  font-weight: 600;
                  padding: 6px 0;
                }
                /* 아웃라인을 줄이고 더 미니멀하게 */
                .fc-theme-standard .fc-scrollgrid {
                  border: 1px solid #f1f5f9; /* slate-100 */
                  border-radius: 12px;
                }
                .fc-theme-standard td, 
                .fc-theme-standard th {
                  border: 1px solid #f1f5f9;
                }
                /* 날짜 숫자 */
                .fc .fc-daygrid-day-number {
                  color: #1f2937;          /* gray-800 */
                  font-weight: 600;
                  padding: 8px 10px;
                }
                /* 이벤트 칩: 배경색을 이벤트 컬러로 */
                .fc .fc-daygrid-event {
                  background: var(--event-color, #6b7280);
                  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
                }
                /* 각 이벤트별 색상 적용 */
                .fc .fc-daygrid-event[style*="background-color"] { background: unset; }
              `}</style>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainForm;
